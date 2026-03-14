import mongoose from "mongoose";

const timeslotSchema = new mongoose.Schema({
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
})

timeslotSchema.index({ docId: 1, date: 1, time: 1}, {unique: true})

const timeslotModel = mongoose.models.timeslot || mongoose.model('timeslot', timeslotSchema)

export default timeslotModel