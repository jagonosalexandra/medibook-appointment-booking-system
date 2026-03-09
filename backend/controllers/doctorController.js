import doctorModel from "../models/doctorModel.js";

// API for getting doctor
const doctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})

        res.json({ success: true, doctors: doctors, message: "Fetch doctor!" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export { doctors }