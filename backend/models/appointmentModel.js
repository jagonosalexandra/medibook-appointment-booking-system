import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    referenceNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctor: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },  
    time: { type: String, required: true },
    appointmentType: { type: String, required: true },
    fee: { type: Number, required: true },
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