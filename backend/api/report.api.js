const { ProfileMiddleware } = require("../models/profile.model");
const { Report } = require("../models/report.model");
const { PERMISSIONS } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");
const router = require("express").Router();

router.get("/reports", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_REPORTS), async (req, res) => {
    try {
        const reports = await Report.get({});
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;