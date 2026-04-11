import doctorModel from "../models/doctorModel.js";

// API for getting doctor
const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ isActive: true })

        res.status(200).json({ success: true, doctors: doctors, message: "Fetch doctor!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params
        const doctor = await doctorModel.findById(id)
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" })

        res.status(200).json({ success: true, doctor })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    getDoctors,
    getDoctorById
}