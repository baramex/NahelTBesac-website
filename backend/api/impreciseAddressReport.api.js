const { ProfileMiddleware, Profile } = require("../models/profile.model");
const { PERMISSIONS } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");
const { header, footer, transporter } = require("../server");
const { ObjectId } = require("mongodb");
const { ImpreciseAddressReport } = require("../models/impreciseAddressReport");
const router = require("express").Router();

router.get("/imprecise-address-reports", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_REPORTS), async (req, res) => {
    try {
        let { startDate } = req.query;
        const query = {};

        startDate = new Date(startDate);
        if (startDate && !isNaN(startDate)) query.date = { $gte: startDate };

        const reports = await ImpreciseAddressReport.get(query);
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.get("/imprecise-address-report/:id", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) throw new Error("Requête invalide.");

        const report = await ImpreciseAddressReport.getById(req.params.id);
        if (!report || (!report.profile._id.equals(req.profile._id) && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.post("/imprecise-address-report", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.CREATE_REPORT), async (req, res) => {
    try {
        if (!req.body) throw new Error("Requête invalide.");

        const { packageNumber, note } = req.body;
        if (typeof packageNumber !== "string" || (note && typeof note !== "string")) throw new Error("Requête invalide.");

        const report = await ImpreciseAddressReport.create(req.profile._id, packageNumber, note);
        res.status(200).json(report);

        (async () => {
            try {
                const mails = await Profile.getMailList(PERMISSIONS.VIEW_REPORTS);
                if (mails.length > 0) {
                    await transporter.sendMail({
                        from: '"Nahel Transport" <no-reply@naheltbesac.fr>',
                        to: mails.join(", "),
                        subject: "[Nahel Transport] Nouveau rapport adresse imprécise",
                        text: `Un nouveau rapport d'adresse imprécise a été créé par ${req.profile.name.firstname} ${req.profile.name.lastname}.\n\nCliquez ici pour accéder au rapport : https://naheltbesac.fr/imprecise-address-report/${report._id}.`,
                        html: `${header}Un nouveau rapport d'adresse imprécise a été créé par <strong>${req.profile.name.firstname} ${req.profile.name.lastname}</strong>.<br/><br/><a href="https://naheltbesac.fr/imprecise-address-report/${report._id}">Cliquez ici</a> pour accéder au rapport.${footer}`
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

module.exports = router;