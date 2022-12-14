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
    round: { type: Number, required: true }, // type ? min ? max ?
    opinion: { type: Number, required: true, min: 1, max: 5 },
    mileage: { type: Number, required: true, min: 0 },
    fuel: { type: Number, required: true, min: 0, max: 100 },
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

    static async create(profileId, round, opinion, mileage, fuel, packetsNotDelivered) {
        return (await new ReportModel({ profile: profileId, round, opinion, mileage, fuel, packetsNotDelivered }).save()).populate(Report.populate);
    }

    static getByProfileId(profileId) {
        return ReportModel.find({ profile: profileId }, {}, { sort: { date: -1 } }).populate(Report.populate).exists("profile", true); // TODO: check if exists works
    }

    static get(query) {
        return ReportModel.find(query, {}, { sort: { date: -1 } }).populate(Report.populate).exists("profile", true);
    }
}

module.exports = { Report }