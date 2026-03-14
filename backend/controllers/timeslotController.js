import timeslotModel from "../models/timeslotModel.js";

// API controller for getting timeslots
const timeslots = async (req, res) => {
    try {
        const { docId, date } = req.query

        if (!docId || !date) {
            return res.status(400).json({ success: false, message: "Doctor ID and date are required." });
        }

        const slots = await timeslotModel.find({ docId: docId, date: date });

        res.status(200).json({ success: true, slots, message: "Fetch slots!"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching time slots", error });
    }
}

export {timeslots}