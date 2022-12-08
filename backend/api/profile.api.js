const { ObjectId } = require('mongodb');
const { Profile, ProfileMiddleware } = require('../models/profile.model');
const { PERMISSIONS } = require('../models/role.model');
const { SessionMiddleware } = require('../models/session.model');
const { rateLimit } = require("express-rate-limit");

const router = require('express').Router();

// create profile
router.post("/", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.requiresPermissions(PERMISSIONS.CREATE_PROFILE), async (req, res) => {
    try {
        if (!req.body) throw new Error("Requête invalide.");

        const { name, password, email, role } = req.body;
        if (typeof name != "object" || typeof name.firstname != "string" || typeof name.lastname != "string" || typeof password != "string" || typeof email != "string" || typeof role != "string") throw new Error("Requête invalide.");

        const profile = await Profile.create(name.firstname, name.lastname, password, email, role);
        res.status(201).json(Profile.getProfileFields(profile, false));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

// get profile
router.get("/:id", SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.parseParamsProfile(), async (req, res) => {
    try {
        res.status(200).send(Profile.getProfileFields(req.paramsProfile, Profile.hasPermission(req.profile, !PERMISSIONS.VIEW_PROFILE)));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

// patch profile
router.patch("/:id", rateLimit({
    windowMs: 1000 * 30,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
}), SessionMiddleware.requiresValidAuthExpress, ProfileMiddleware.parseParamsProfile(PERMISSIONS.EDIT_PROFILE), async (req, res) => {
    try {
        if (!req.body) throw new Error("Requête invalide.");
        const profile = req.paramsProfile;

        if (typeof req.body.email == "string") {
            profile.email = req.body.email;
        }
        if (typeof req.body.name?.firstname == "string") {
            profile.name.firstname = req.body.name.firstname;
        }
        if (typeof req.body.name?.lastname == "string") {
            profile.name.lastname = req.body.name.lastname;
        }
        if (typeof req.body.password == "string") {
            profile.password = req.body.password;
        }
        if (ObjectId.isValid(req.body.role)) {
            profile.role = req.body.role;
        }
        await profile.save({ validateBeforeSave: true }).populate("role");

        res.status(200).send(Profile.getProfileFields(profile, false));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;