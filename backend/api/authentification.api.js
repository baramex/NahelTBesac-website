const { Profile } = require("../models/profile.model");
const { SessionMiddleware, Session } = require("../models/session.model");
const { getClientIp } = require("request-ip");
const { rateLimit } = require("express-rate-limit");

const router = require("express").Router();

// déconnexion
router.post("/logout", SessionMiddleware.requiresValidAuthExpress, async (req, res) => {
    try {
        await Session.disable(req.session);
        res.clearCookie("token").clearCookie("refreshToken").sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

// connexion
router.post("/login", rateLimit({
    windowMs: 1000 * 60,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
}), SessionMiddleware.isValidAuthExpress, async (req, res) => {
    try {
        if (!req.body) throw new Error("Requête invalide.");
        if (req.isAuthed) throw new Error("Vous êtes déjà authentifié.");

        const { email, password } = req.body;
        if (typeof email != "string" || typeof password != "string") throw new Error("Requête invalide.");

        const profile = await Profile.check(email, password);
        if (!profile) throw new Error("Identifants incorrects.");

        let session = await Session.getSessionByProfileId(profile._id);
        const ip = getClientIp(req);
        if (session) {
            session.active = true;
            if (!session.ips.includes(ip)) session.ips.push(ip);
            await session.save({ validateBeforeSave: true });
        } else {
            session = await Session.create(profile._id, ip);
        }

        const expires = new Date(Session.expiresIn * 1000 + new Date().getTime());
        const expiresRefresh = new Date(Session.expiresInRefresh * 1000 + new Date().getTime());
        res.cookie("token", session.token, { expires }).cookie("refreshToken", session.refreshToken, { expires: expiresRefresh }).json(Profile.getProfileFields(profile, true));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

// refresh token
router.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (typeof refreshToken != "string") throw new Error("Requête invalide.");

        let session = await Session.getSessionByRefreshToken(refreshToken);

        const profile = session?.profile;
        if (!session || typeof profile != "object") {
            res.clearCookie("refreshToken");
            throw new Error("Jeton de rafraîchissement invalide.");
        }

        const ip = getClientIp(req);
        if (session.active) await Session.disable(session);

        session.active = true;
        if (!session.ips.includes(ip)) session.ips.push(ip);
        await session.save({ validateBeforeSave: true });

        const expires = new Date(Session.expiresIn * 1000 + new Date().getTime());
        const expiresRefresh = new Date(Session.expiresInRefresh * 1000 + new Date().getTime());
        res.cookie("token", session.token, { expires }).cookie("refreshToken", session.refreshToken, { expires: expiresRefresh }).json(Profile.getProfileFields(profile, true));
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message || "Une erreur est survenue.");
    }
});

module.exports = router;