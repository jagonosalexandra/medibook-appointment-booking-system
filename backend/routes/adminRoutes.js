import express from 'express';
import {
    addDoctor,
    adminDashboard,
    updateDoctor,
    addTimeSlots,
    doctors,
    getTimeSlots,
    toggleSlotAvailability,
    toggleDoctorActive
} from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    appointments,
    updateAppointment,
} from '../controllers/appointmentController.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.get('/dashboard', authMiddleware, adminDashboard)
adminRouter.get('/appointments', authMiddleware, appointments)
adminRouter.put('/update-appointment/:id', authMiddleware, updateAppointment)
adminRouter.post('/add-doctor', authMiddleware, upload.single("image"), addDoctor)
adminRouter.put('/update-doctor/:id', authMiddleware, upload.single("image"), updateDoctor)
adminRouter.get('/doctors', authMiddleware, doctors)
adminRouter.post('/add-slots', authMiddleware, addTimeSlots)
adminRouter.get('/get-slots/:docId', authMiddleware, getTimeSlots)
adminRouter.post('/toggle-slot', authMiddleware, toggleSlotAvailability)
adminRouter.post('/toggle-doctor', authMiddleware, toggleDoctorActive)

export default adminRouter