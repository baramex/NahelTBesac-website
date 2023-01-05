const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const impreciseAddressReportSchema = new Schema({
    profile: { type: ObjectId, required: true, ref: "Profile" },
    packageNumber: { type: String, required: true, maxlength: 20 },
    note: { type: String, required: false, maxlength: 1028 },
    date: { type: Date, default: Date.now, required: true }
});

const ImpreciseAddressReportModel = model("ImpreciseAddressReport", impreciseAddressReportSchema, "impreciseAddressReports");

class ImpreciseAddressReport {
    static populate = {
        path: "profile",
        select: "name"
    };

    static async create(profileId, packageNumber, note) {
        return (await new ImpreciseAddressReportModel({ profile: profileId, packageNumber, note }).save()).populate(ImpreciseAddressReport.populate);
    }

    static async getByProfileId(profileId) {
        return (await ImpreciseAddressReportModel.find({ profile: profileId }, {}, { sort: { date: -1 } }).populate(ImpreciseAddressReport.populate)).filter(a => a.profile);
    }

    static async getLast(profileId) {
        const res = await ImpreciseAddressReportModel.findOne({ profile: profileId }, {}, { sort: { date: -1 } }).populate(ImpreciseAddressReport.populate);
        return res?.profile ? res : null;
    }

    static async get(query) {
        return (await ImpreciseAddressReportModel.find(query, {}, { sort: { date: -1 } }).populate(ImpreciseAddressReport.populate)).filter(a => a.profile);
    }

    static async getById(id) {
        const res = await ImpreciseAddressReportModel.findById(id).populate(ImpreciseAddressReport.populate);
        return res?.profile ? res : null;
    }
}

module.exports = { ImpreciseAddressReport }