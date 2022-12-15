const { genSync } = require("random-web-token");
const { ProfileMiddleware, Profile } = require("../models/profile.model");
const { Report } = require("../models/report.model");
const { PERMISSIONS } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");
const { upload } = require("../server");
const fs = require("fs");
const path = require("path");
const router = require("express").Router();

router.get("/reports", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_REPORTS), async (req, res) => {
    try {
        let { startDate } = req.query;
        const query = {};

        startDate = new Date(startDate);
        if (startDate) query.date = { $gte: startDate };

        const reports = await Report.get(query);
        res.status(200).json(reports);
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

        packetsNotDelivered = packetsNotDelivered.map(a => ({ id: a.id, reason: a.reason, comment: a.comment }));

        const files = req.files;
        for (const file of files) {
            const id = file.fieldname.split("-")[1];
            if (!id || !packetsNotDelivered.find(a => a.id === id)) continue;
            const name = genSync("extra", 30) + path.extname(file.originalname);
            packetsNotDelivered.find(a => a.id === id).photo = name;
            fs.writeFileSync(path.join(__dirname, "..", "images", name), file.buffer);
        }

        // TODO: send mail

        const report = await Report.create(req.profile._id, round, opinion, mileage, fuel, packetsNotDelivered);
        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

router.get("/report/:report_id/packetNotDelivered/:packet_id/photo", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        const report = await Report.getById(req.params.report_id);
        if (!report || (report.profile._id !== req.profile._id && !Profile.hasPermission(req.profile, PERMISSIONS.VIEW_REPORTS))) throw new Error("Rapport introuvable.");

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