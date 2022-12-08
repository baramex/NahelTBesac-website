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
    static populate = "profile profile.role";

    static create(profileId, round, opinion, mileage, petrol, packetNotDelivered) {
        return new ReportModel({ profile: profileId, round, opinion, mileage, petrol, packetNotDelivered }).populate(this.populate).save();
    }

    static getByProfileId(profileId) {
        return ReportModel.find({ profile: profileId }).populate(this.populate);
    }

    static getFromDayBefore() {
        const dayBefore = new Date();
        dayBefore.setDate(dayBefore.getDate() - 1);
        dayBefore.setHours(0, 0, 0, 0);

        return ReportModel.find({ date: { $gte: dayBefore } }).populate(this.populate);
    }
}

module.exports = { Report, PERMISSIONS }