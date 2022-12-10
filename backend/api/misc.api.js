const { ProfileMiddleware } = require("../models/profile.model");
const { PERMISSIONS, Role } = require("../models/role.model");
const { SessionMiddleware } = require("../models/session.model");

const router = require("express").Router();

router.get("/roles", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.VIEW_ROLES), async (req, res) => {
    try {
        const roles = await Role.getAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;