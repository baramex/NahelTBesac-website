const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const NOT_DELIVERED_REASONS = {
    NPAI: 0,
    ACCESS_PROBLEM: 1,
    NOT_ATTEMPTED: 2,
    OTHER: 3
};

const reportSchema = new Schema({
    profile: { type: ObjectId, required: true, ref: "Profile" },
    round: { type: String, validate: /^[a-z]$/i, required: true },
    opinion: { type: Number, required: true, min: 1, max: 5 },
    mileage: { type: Number, required: true, min: 0 },
    fuel: { type: Number, required: true, min: 0, max: 100 },
    licensePlate: { type: String, validate: /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/, required: true },
    packetsNotDelivered: {
        type: [{
            reason: { type: Number, enum: Object.values(NOT_DELIVERED_REASONS) },
            photo: { type: String, required: true },
            note: { type: String, maxlength: 1028 }
        }], required: true
    },
    date: { type: Date, default: Date.now, required: true }
});

const ReportModel = model("Report", reportSchema, "reports");

class Report {
    static populate = {
        path: "profile",
        select: "name"
    };

    static async create(profileId, round, opinion, mileage, fuel, licensePlate, packetsNotDelivered) {
        return (await new ReportModel({ profile: profileId, round, opinion, mileage, fuel, licensePlate, packetsNotDelivered }).save()).populate(Report.populate);
    }

    static async getByProfileId(profileId) {
        return (await ReportModel.find({ profile: profileId }, {}, { sort: { date: -1 } }).populate(Report.populate)).filter(a => a.profile);
    }

    static async getLast(profileId) {
        const res = await ReportModel.findOne({ profile: profileId }, {}, { sort: { date: -1 } }).populate(Report.populate);
        return res?.profile ? res : null;
    }

    static async get(query) {
        return (await ReportModel.find(query, {}, { sort: { date: -1 } }).populate(Report.populate)).filter(a => a.profile);
    }

    static async getById(id) {
        const res = await ReportModel.findById(id).populate(Report.populate);
        return res?.profile ? res : null;
    }
}

module.exports = { Report }