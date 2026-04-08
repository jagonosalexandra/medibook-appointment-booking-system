import express from 'express';
import { addDoctor, adminDashboard, updateDoctor } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { appointments, updateAppointment } from '../controllers/appointmentController.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.get('/dashboard', authMiddleware, adminDashboard)
adminRouter.get('/appointments', authMiddleware, appointments)
adminRouter.put('/update-appointment/:id', authMiddleware, updateAppointment)
adminRouter.post('/add-doctor', authMiddleware, upload.single("image"), addDoctor)
adminRouter.put('/update-doctor/:id', authMiddleware, upload.single("image"), updateDoctor)

export default adminRouter