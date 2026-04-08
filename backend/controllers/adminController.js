import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { v2 as cloudinary } from 'cloudinary'

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]

        const [
            doctorCount,
            totalAppointments,
            appointmentsToday,
            appointmentsPending,
            latestAppointments
        ] = await Promise.all([
            doctorModel.countDocuments({}),
            appointmentModel.countDocuments({}),
            appointmentModel.countDocuments({ createdAt: today }),
            appointmentModel.countDocuments({ status: 'pending' }),
            appointmentModel.find({}).sort({ createdAt: -1 }).limit(5)
        ])

        const dashData = {
            doctors: doctorCount,
            totalAppointments,
            appointmentsToday,
            appointmentsPending,
            latestAppointments
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            department,
            address,
            bio,
            education,
            certifications,
            specialties,
            experience,
            fee
        } = req.body
        const imageFile = req.file

        if (
            !name ||
            !department ||
            !address ||
            !bio ||
            !education ||
            !certifications ||
            !specialties ||
            !experience ||
            !fee
        ) {
            return res.status(400).json({ success: false, message: "Missing details" })
        }
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Doctor photo is required" })
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        })
        const photoUrl = imageUpload.secure_url

        const doctorData = {
            name,
            photoUrl,
            department,
            address: JSON.parse(address),
            bio,
            education,
            certifications: JSON.parse(certifications),
            specialties: JSON.parse(specialties),
            experience,
            fee
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor added!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// API for updating doctor data
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            department,
            address,
            bio,
            education,
            certifications,
            specialties,
            experience,
            fee
        } = req.body
        const imageFile = req.file

        const doctor = await doctorModel.findById(id)
        if (!doctor) {
            return res.status(401).json({ success: false, message: "Doctor not found" })
        }

        const updateData = {
            name,
            department,
            address: JSON.parse(address),
            bio,
            education,
            certifications: JSON.parse(certifications),
            specialties: JSON.parse(specialties),
            experience,
            fee
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            })
            updateData.photoUrl = imageUpload.secure_url
        }

        await doctorModel.findByIdAndUpdate(id, updateData)

        res.json({ success: true, message: "Doctor profile updated!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    adminDashboard,
    addDoctor,
    updateDoctor
}