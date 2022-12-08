const { Schema, model } = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");
const { ObjectId } = require("mongodb");
const { hash, compare } = require("bcrypt");
const { PERMISSIONS } = require("./role.model");
const { CustomError } = require("../server");

const NAME_REGEX = /^[A-ZÀ-ÿ][a-zà-ÿ]{1,31}$/;
const LASTNAME_REGEX = /^[A-Zà-ÿ]{2,32}$/;
const PASSWORD_REGEX = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,32}$)/;

const profileSchema = new Schema({
    name: {
        type: {
            firstname: { type: String, required: true, validate: { validator: NAME_REGEX, message: "Le prénom est invalide." } },
            lastname: { type: String, required: true, validate: { validator: LASTNAME_REGEX, message: "Le nom est invalide." } },
            _id: false
        },
        required: true
    },
    email: { type: String, trim: true, lowercase: true, required: true, validate: { validator: isEmail, message: "L'adresse email est invalide." } },
    role: { type: ObjectId, ref: "Role", required: true },
    password: { type: String, trim: true },
    date: { type: Date, default: Date.now, required: true }
});
profileSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        if (!PASSWORD_REGEX.test(this.password)) throw new Error("Le mot de passe est invalide.");
        this.password = await hash(this.password, 10);
    }
    next();
});

const ProfileModel = model("Profile", profileSchema, "profiles");

class Profile {
    static populate = "role";

    static create(fistname, lastname, password, email, role) {
        return new ProfileModel({ name: { fistname, lastname }, password, email, role }).populate(this.populate).save();
    }

    static hasPermission(profile, ...permissions) {
        if (!permissions || permissions.length == 0) return true;
        return permissions.every(p => profile.role.permissions.includes(p)) || profile.role.permissions.includes(PERMISSIONS.ALL);
    }

    static getProfileById(id) {
        return ProfileModel.findById(id).populate(this.populate);
    }

    static getAll() {
        return ProfileModel.find().populate(this.populate);
    }

    static async check(email, password) {
        if (!email || !password) return false;
        const profile = await ProfileModel.findOne({ email }).populate(this.populate);
        if (!profile) return false;
        if (!profile.password) return false;
        if (await compare(password, profile.password)) return profile;
        return false;
    }

    static getProfileFields(profile, partial = true) {
        return partial ? { name: profile.name, role: profile.role?.name } : {
            _id: profile._id, name: profile.name, email: profile.email, role: profile.role, date: profile.date
        };
    }
}

class ProfileMiddleware {
    static parseParamsProfile(...permissions) {
        return (req, res, next) => {
            try {
                const id = req.params.id;
                if (!id || id != "@me" || !ObjectId.isValid(id)) throw new Error("Requête invalide.");

                if (!req.profile || (id != "@me" && !Profile.hasPermission(req.profile, ...permissions))) throw new CustomError("Vous n'avez pas les permissions nécessaires.", 403);

                const profile = Profile.getProfileById(id);
                if (!profile) throw new Error("Utilisateur introuvable.");

                req.paramsProfile = profile;
                next();
            } catch (error) {
                console.error(error);
                res.status(error.status || 400).send(error.message || "Une erreur est survenue.");
            }
        }
    }

    static requiresPermissions(...permissions) {
        return (req, res, next) => {
            try {
                if (!req.profile || !Profile.hasPermission(req.profile, ...permissions)) throw new CustomError("Vous n'avez pas les permissions nécessaires.", 403);
                next();
            } catch (error) {
                console.error(error);
                res.status(error.status || 400).send(error.message || "Une erreur est survenue.");
            }
        }
    }
}

module.exports = { Profile, ProfileMiddleware };