const { genSync } = require("random-web-token");
const { ProfileMiddleware, Profile } = require("../models/profile.model");
const { PERMISSIONS } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");
const { upload, transporter, header, footer } = require("../server");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { MorningReport } = require("../models/morningReport.model");
const router = require("express").Router();

router.get("/morning-reports", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_REPORTS), async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        const query = {};

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        if (startDate && !isNaN(startDate)) query.date = { $gte: startDate };
        if (endDate && !isNaN(endDate)) query.date = { ...query.date, $lte: endDate };

        const reports = await MorningReport.get(query);
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.get("/morning-report/:id", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) throw new Error("Requête invalide.");

        const report = await MorningReport.getById(req.params.id);
        if (!report || (!report.profile._id.equals(req.profile._id) && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.post("/morning-report", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.CREATE_REPORT), upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) throw new Error("Vous devez envoyer une photo.");

        const lastReport = await MorningReport.getLast(req.profile._id);
        const dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);
        if (lastReport && lastReport.date > dayDate) throw new Error("Vous avez déjà créé un rapport aujourd'hui.");

        const file = req.file;
        const name = genSync("extra", 30) + path.extname(file.originalname);
        fs.writeFileSync(path.join(__dirname, "..", "images", name), file.buffer);

        const report = await MorningReport.create(req.profile._id, name);
        res.status(200).json(report);

        (async () => {
            try {
                const mails = await Profile.getMailList(PERMISSIONS.VIEW_REPORTS);
                if (mails.length > 0) {
                    await transporter.sendMail({
                        from: '"Nahel Transport" <no-reply@naheltbesac.fr>',
                        to: mails.join(", "),
                        subject: "[Nahel Transport] Nouveau rapport du matin",
                        text: `Un nouveau rapport du matin a été créé par ${req.profile.name.firstname} ${req.profile.name.lastname}.\n\nCliquez ici pour accéder au rapport : https://naheltbesac.fr/morning-report/${report._id}.`,
                        html: `${header}Un nouveau rapport du matin a été créé par <strong>${req.profile.name.firstname} ${req.profile.name.lastname}</strong>.<br/><br/><a href="https://naheltbesac.fr/morning-report/${report._id}">Cliquez ici</a> pour accéder au rapport.${footer}`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        })();
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.get("/morning-report/:id/photo", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) throw new Error("Requête invalide.");

        const report = await MorningReport.getById(req.params.id);
        if (!report || (!report.profile._id.equals(req.profile._id) && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

        res.status(200).sendFile(path.join(__dirname, "..", "images", report.photo));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;