const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");
const token = require("random-web-token");
const { Profile } = require("./profile.model");

const session = new Schema({
    refreshToken: { type: String, unique: true },
    token: { type: String, unique: true },
    profile: { type: ObjectId, ref: "Profile", required: true, unique: true },
    ips: { type: [String], required: true },
    active: { type: Boolean, default: true, required: true },
    date: { type: Date, default: Date.now, required: true },
});

session.post("validate", async function (doc, next) {
    if (doc.isModified("active") || doc.isNew) {
        if (doc.active) {
            doc.token = token.genSync("extra", 30);
            doc.refreshToken = token.genSync("extra", 40);
            doc.date = new Date();

            doc.markModified("token");
            doc.markModified("refreshToken");
            doc.markModified("date");
        }
        else {
            doc.token = undefined;

            doc.markModified("token");
        }
    }

    next();
});

const SessionModel = model('Session', session);

class Session {
    static expiresIn = 60 * 60 * 24 * 2;
    static expiresInRefresh = 60 * 60 * 24 * 7;
    static populate = "profile";

    /**
     * 
     * @param {ObjectId} profileId 
     * @param {String} ip 
     * @returns 
     */
    static create(profileId, ip) {
        return new SessionModel({ profile: profileId, ips: [ip] });
    }

    static disable(session) {
        session.active = false;
        return session.save({ validateBeforeSave: true });
    }

    /**
     * 
     * @param {ObjectId} id 
     * @param {String} ip 
     */
    static addIp(id, ip) {
        return SessionModel.updateOne({ _id: id }, { $addToSet: { ips: ip } });
    }

    /**
     * 
     * @param {String} token 
     * @returns 
     */
    static getSessionByToken(token) {
        return SessionModel.findOne({ token, active: true }).populate(this.populate);
    }

    /**
     * 
     * @param {Date} date 
     */
    static checkExpired(date) {
        return new Date().getTime() - date.getTime() > this.expiresIn * 1000;
    }

    /**
     * 
     * @param {ObjectId} profileId 
     * @returns 
     */
    static getSessionByProfileId(profileId) {
        return SessionModel.findOne({ profile: profileId }).populate(this.populate);
    }

    static update() {
        SessionModel.updateMany({ active: true, date: { $gt: new Date().getTime() - this.expiresIn * 1000 } }, { $set: { active: false }, $unset: { token: true } }, { runValidators: true });
    }
}

class SessionMiddleware {
    static async checkValidAuth(cookies) {
        if (!cookies) throw new Error();

        const token = cookies.token;
        if (!token) throw new Error();

        const session = await Session.getSessionByToken(token);
        if (!session || !session.profile || typeof session.profile !== "object") throw new Error();

        return { profile: session.profile, session };
    }

    static async requiresValidAuthExpress(req, res, next) {
        try {
            const result = await Middleware.checkValidAuth(req.cookies);
            req.profile = result.profile;
            req.session = result.session;

            next();
        } catch (error) {
            console.error(error);
            res.clearCookie("token").sendStatus(401);
        }
    }

    static async isValidAuthExpress(req, res, next) {
        try {
            await Middleware.checkValidAuth(req.cookies);
            req.isAuthed = true;
        } catch (error) {
            req.isAuthed = false;
        }
        next();
    }
}

setInterval(Session.update, 1000 * 60 * 30);
module.exports = { Session, SessionMiddleware };