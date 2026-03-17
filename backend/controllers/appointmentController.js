import appointmentModel from "../models/appointmentModel.js";
import timeslotModel from "../models/timeslotModel.js"
import { generateReference } from "../utils/generateReference.js";

const createAppointment = async (req, res) => {
    try {
        const referenceNumber = await generateReference()

        const appointment = await appointmentModel.create({
            ...req.body,
            referenceNumber,
            status: 'pending'
        })

        const updateSlot = await timeslotModel.findOneAndUpdate(
            {
                docId: req.body.docId,
                date: req.body.date,
                time: req.body.time,
            },
            { isAvailable: false },
            { new: true }
        )

        if (!updateSlot) {
            console.warn(
                `No slot found to mark unavailable — docId: ${req.body.docId}, ` +
                `date: ${req.body.date}, time: ${req.body.time}`
            )
        }

        res.status(201).json({ success: true, data: appointment, message: "Appointment created!" })

    } catch (error) {
        console.error('Error creating appointment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const { status, adminNotes } = req.body

        const existing = await appointmentModel.findById(id)
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }

        const updated = await appointmentModel.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        )

        if (status === 'cancelled') {
            await timeslotModel.findOneAndUpdate(
                {
                    docId: existing.docId,
                    date: existing.date,
                    time: existing.time,
                },
                { isAvailable: true }
            )
        }

        if (existing.status === 'cancelled' && status !== 'cancelled') {
            await timeslotModel.findOneAndUpdate(
                {
                    docId: existing.docId,
                    date: existing.date,
                    time: existing.time,
                },
                { isAvailable: false }
            )
        }

        res.status(200).json({ success: true, data: updated })

    } catch (error) {
        console.error('Error updating appointment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { createAppointment }