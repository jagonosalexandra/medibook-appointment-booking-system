import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import timeslotModel from '../models/timeslotModel.js'
import { v2 as cloudinary } from 'cloudinary'

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const [
            doctorCount,
            totalAppointments,
            appointmentsToday,
            appointmentsPending,
            latestAppointments
        ] = await Promise.all([
            doctorModel.countDocuments({}),
            appointmentModel.countDocuments({}),
            appointmentModel.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } }),
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
            return res.status(404).json({ success: false, message: "Doctor not found" })
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

const doctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ })

        res.json({ success: true, doctors: doctors, message: "Fetch doctor!" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

//API for adding doctor available time slots
const addTimeSlots = async (req, res) => {
    try {
        const {
            docId,
            startDate,
            endDate,
            selectedDays,
            timeSlots
        } = req.body

        if (!docId || !startDate || !endDate || !selectedDays || !timeSlots) {
            return res.status(400).json({ success: false, message: "Missing schedule details" })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        const slotsToAdd = []

        let current = new Date(start)
        while (current <= end) {
            const day = current.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
            const dateStr = current.toISOString().split('T')[0]

            if (selectedDays.includes(day)) {
                timeSlots.forEach(time => {
                    slotsToAdd.push({
                        docId,
                        date: dateStr,
                        time,
                        isAvailable: true
                    })
                })
            }

            current.setDate(current.getDate() + 1)
        }

        const operations = slotsToAdd.map(slot => ({
            updateOne: {
                filter: { docId: slot.docId, date: slot.date, time: slot.time },
                update: { $setOnInsert: slot },
                upsert: true
            }
        }))

        await timeslotModel.bulkWrite(operations)
        res.status(200).json({ success: true, message: `Successfully scheduled ${slotsToAdd.length} slots!` })
    } catch (error) {
        console.error('Error adding slots:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}


// API for fetching doctor available time slots
const getTimeSlots = async (req, res) => {
    try {
        const {docId} = req.params
        const slots = await timeslotModel.find({ docId }).sort({ date: 1, time: 1 })
        res.status(200).json({ success: true, slots, message: "Fetch time slots!" })
    } catch (error) {
        console.error('Error fetching slots:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to delete or toggle time slot availability when doctor goes on leave
const toggleSlotAvailability = async (req, res) => {
    try {
        const {slotId} = req.body
        const slot = await timeslotModel.findById(slotId)
        if (!slot) return res.status(404).json({ success: false, message: "Slot not found" })
        
        slot.isAvailable = !slot.isAvailable
        await slot.save()

        res.status(200).json({ success: true, slot, message: `Slot marked as ${slot.isAvailable ? 'available' : 'unavailable'}` })
    } catch (error) {
        console.error('Error toggling slot availability:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const toggleDoctorActive = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await doctorModel.findById(docId)
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" })
        
        doctor.isActive = !doctor.isActive
        await doctor.save()
        res.status(200).json({ success: true, isActive: doctor.isActive, message: `Doctor ${doctor.isActive ? 'Activated' : 'Deactivated'} successfully!` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    adminDashboard,
    addDoctor,
    updateDoctor,
    doctors,
    addTimeSlots,
    getTimeSlots,
    toggleSlotAvailability,
    toggleDoctorActive
}