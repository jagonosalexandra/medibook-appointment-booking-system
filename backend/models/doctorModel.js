import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    photoUrl: { type: String, required: true },
    address: { 
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    bio: { type: String, required: true },
    education: { type: String, required: true },
    certifications: { type: [String], required: true },
    specialties: { type: [String], required: true },
    experience: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    fee: { type: Number, required: true }
}, { minimize: false, timestamps: true })

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel

