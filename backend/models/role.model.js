const { Schema, model } = require("mongoose");

const PERMISSIONS = {
    ALL: 0,
    VIEW_PROFILE: 1,
    EDIT_PROFILE: 2,
    CREATE_PROFILE: 3
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