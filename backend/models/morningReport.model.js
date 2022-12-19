const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const morningReportSchema = new Schema({
    profile: { type: ObjectId, required: true, ref: "Profile" },
    photo: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true }
});

const MorningReportModel = model("MorningReport", morningReportSchema, "morningReports");

class MorningReport {
    static populate = {
        path: "profile",
        select: "name"
    };

    static async create(profileId, photo) {
        return (await new MorningReportModel({ profile: profileId, photo }).save()).populate(MorningReport.populate);
    }

    static async getByProfileId(profileId) {
        return (await MorningReportModel.find({ profile: profileId }, {}, { sort: { date: -1 } }).populate(MorningReport.populate)).filter(a => a.profile);
    }

    static async getLast(profileId) {
        const res = await MorningReportModel.findOne({ profile: profileId }, {}, { sort: { date: -1 } }).populate(MorningReport.populate);
        return res?.profile ? res : null;
    }

    static async get(query) {
        return (await MorningReportModel.find(query, {}, { sort: { date: -1 } }).populate(MorningReport.populate)).filter(a => a.profile);
    }

    static async getById(id) {
        const res = await MorningReportModel.findById(id).populate(MorningReport.populate);
        return res?.profile ? res : null;
    }
}

module.exports = { MorningReport }