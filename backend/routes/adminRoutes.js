import express from 'express';
import { adminDashboard } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const adminRouter = express.Router()

adminRouter.get('/dashboard', authMiddleware, adminDashboard)

export default adminRouter