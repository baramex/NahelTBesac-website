const { Schema, model } = require("mongoose");

const PERMISSIONS = {
    ALL: 0,
    VIEW_PROFILES: 1,
    EDIT_PROFILES: 2,
    CREATE_PROFILE: 3,
    CREATE_REPORT: 4,
    VIEW_REPORTS: 5
};

const roleSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, validate: { validator: /^[a-zà-ÿ]{1,128}$/i, message: "Le nom du rôle est invalide." } },
    permissions: { type: [{ type: Number, enum: Object.values(PERMISSIONS) }], required: true }
});

const RoleModel = model("Role", roleSchema, "roles");

class Role {
    static create(name, permissions) {
        return new RoleModel({ name, permissions }).save();
    }

    static getAll() {
        return RoleModel.find().select("name");
    }
}

module.exports = { Role, PERMISSIONS }