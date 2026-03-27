import express from 'express';
import { adminDashboard } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { appointments, updateAppointment } from '../controllers/appointmentController.js'

const adminRouter = express.Router()

adminRouter.get('/dashboard', authMiddleware, adminDashboard)
adminRouter.get('/appointments', authMiddleware, appointments)
adminRouter.put('/update-appointment/:id', authMiddleware, updateAppointment)

export default adminRouter