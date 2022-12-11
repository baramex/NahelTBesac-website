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
    petrol: { type: Number, required: true, min: 0, max: 100 },
    packetNotDelivered: {
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

    static async create(profileId, round, opinion, mileage, petrol, packetNotDelivered) {
        return (await new ReportModel({ profile: profileId, round, opinion, mileage, petrol, packetNotDelivered }).save()).populate(Report.populate);
    }

    static getByProfileId(profileId) {
        return ReportModel.find({ profile: profileId }, {}, { sort: { date: 1 } }).populate(Report.populate);
    }

    static get(query) {
        return ReportModel.find(query, {}, { sort: { date: 1 } }).populate(Report.populate);
    }
}

module.exports = { Report }