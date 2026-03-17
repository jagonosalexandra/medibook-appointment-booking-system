import appointmentModel from "../models/appointmentModel.js";
import { generateReference } from "../utils/generateReference.js";

export const createAppointment = async (req, res) => {
    try {
        const referenceNumber = await generateReference()

        const appointment = await Appointment.create({
            ...req.body,
            referenceNumber,
            status: 'pending'
        })

        res.status(201).json({ success: true, data: appointment, message: "Appointment created!" })

    } catch (error) {
        console.error('Error creating appointment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}