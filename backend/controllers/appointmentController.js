import appointmentModel from "../models/appointmentModel.js";
import timeslotModel from "../models/timeslotModel.js"
import doctorModel from "../models/doctorModel.js";
import { generateReference } from "../utils/generateReference.js";


// API for creating appointment
const createAppointment = async (req, res) => {
    try {
        const { docId, date, time } = req.body
        if (!docId) return res.status(400).json({ success: false, message: "Missing details" })
        
        const doctor = await doctorModel.findById(docId)
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" })

        const slot = await timeslotModel.findOneAndUpdate(
            { docId, date, time, isAvailable: true },
            { isAvailable: false },
            { new: true }   
        )
        if (!slot) return res.status(409).json({success: false, message: "This slot is no longer available. Please choose another slot."})
        
        const referenceNumber = await generateReference()
        
        const appointment = await appointmentModel.create({
            ...req.body,
            doctor: doctor.name,
            department: doctor.department,
            fee: doctor.fee,
            referenceNumber,
            status: 'pending'
        })

        res.status(201).json({ success: true, data: appointment, message: "Appointment created!" })

    } catch (error) {
        console.error('Error creating appointment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API for getting appointments 
const appointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).sort({ createdAt: -1 })

        res.json({ success: true, appointments, message: "Fetch appointments!" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin appointment update
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const { status, adminNotes } = req.body

        const existing = await appointmentModel.findById(id)
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }

        const current = existing.status;
        const updated = await appointmentModel.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        )

        if (current !== 'cancelled' && status === 'cancelled') {
            await timeslotModel.findOneAndUpdate(
                {
                    docId: existing.docId,
                    date: existing.date,
                    time: existing.time,
                },
                { isAvailable: true }
            )
        }

        if (current === 'cancelled' && status !== 'cancelled') {
            await timeslotModel.findOneAndUpdate(
                {
                    docId: existing.docId,
                    date: existing.date,
                    time: existing.time,
                },
                { isAvailable: false }
            )
        }

        res.status(200).json({ success: true, data: updated, message: `Appointment updated to ${status}` })

    } catch (error) {
        console.error('Error updating appointment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { 
    createAppointment,
    appointments,
    updateAppointment
 }