const { genSync } = require("random-web-token");
const { ProfileMiddleware, Profile } = require("../models/profile.model");
const { Report } = require("../models/report.model");
const { PERMISSIONS } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");
const { upload, mail, header, footer } = require("../server");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { getTestMessageUrl } = require("nodemailer");
const router = require("express").Router();

router.get("/reports", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_REPORTS), async (req, res) => {
    try {
        let { startDate } = req.query;
        const query = {};

        startDate = new Date(startDate);
        if (startDate && !isNaN(startDate)) query.date = { $gte: startDate };

        const reports = await Report.get(query);
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.get("/report/:id", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) throw new Error("Requête invalide.");

        const report = await Report.getById(req.params.id);
        if (!report || (!report.profile._id.equals(req.profile._id) && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.post("/report", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.CREATE_REPORT), upload.any(), async (req, res) => {
    try {
        if (!req.body) throw new Error("Requête invalide.");
        let { round, opinion, mileage, fuel, packetsNotDelivered } = req.body;
        packetsNotDelivered = JSON.parse(packetsNotDelivered);
        if (typeof round !== "string" || typeof opinion !== "string" || typeof mileage !== "string" || typeof fuel !== "string" || !Array.isArray(packetsNotDelivered)) throw new Error("Requête invalide.");

        const lastReport = await Report.getLast(req.profile._id);
        const dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);
        if (lastReport && lastReport.date > dayDate) throw new Error("Vous avez déjà créé un rapport aujourd'hui.");

        packetsNotDelivered = packetsNotDelivered.map(a => ({ id: a.id, reason: a.reason, comment: a.comment }));

        const files = req.files;
        for (const file of files) {
            const id = file.fieldname.split("-")[1];
            if (!id || !packetsNotDelivered.find(a => a.id === id)) continue;
            const name = genSync("extra", 30) + path.extname(file.originalname);
            packetsNotDelivered.find(a => a.id === id).photo = name;
            fs.writeFileSync(path.join(__dirname, "..", "images", name), file.buffer);
        }

        const report = await Report.create(req.profile._id, round, opinion, mileage, fuel, packetsNotDelivered);
        res.status(200).json(report);

        (async () => {
            try {
                const mails = await Profile.getMailList(PERMISSIONS.VIEW_REPORTS);
                if (mails.length > 0) {
                    const m = await mail.transporter.sendMail({
                        from: '"Nahel Transport" <no-reply@naheltbesac.fr',
                        to: mails.join(", "),
                        subject: "[Nahel Transport] Nouveau rapport de tournée",
                        text: `Un nouveau rapport de tournée a été créé par ${req.profile.name.firstname} ${req.profile.name.lastname}.\n\nCliquez ici pour accéder au rapport : https://naheltbesac.fr/report/${report._id}.`,
                        html: `${header}Un nouveau rapport de tournée a été créé par <strong>${req.profile.name.firstname} ${req.profile.name.lastname}</strong>.<br/><br/><a href="https://naheltbesac.fr/report/${report._id}">Cliquez ici</a> pour accéder au rapport.${footer}`
                    });
                    console.log(getTestMessageUrl(m));
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

router.get("/report/:report_id/packetNotDelivered/:packet_id/photo", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.report_id) || !ObjectId.isValid(req.params.packet_id)) throw new Error("Requête invalide.");

        const report = await Report.getById(req.params.report_id);
        if (!report || (!report.profile._id.equals(req.profile._id) && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

        const packet = report.packetsNotDelivered.find(a => a._id.equals(req.params.packet_id));
        if (!packet || !packet.photo) throw new Error("Paquet introuvable.");

        res.sendFile(path.join(__dirname, "..", "images", packet.photo));
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;