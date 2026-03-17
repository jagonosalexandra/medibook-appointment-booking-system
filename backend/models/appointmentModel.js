import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    referenceNumber: { type: String, unique: true, required: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientEmail: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },  
    time: { type: String, required: true },
    appointmentType: { type: String, required: true },
    reasonForVisit: { type: String, default: "" },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    adminNotes: { type: String, default: "" },
}, { timestamps: true })

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel