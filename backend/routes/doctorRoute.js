import express from "express";
import { getDoctorById, getDoctors } from "../controllers/doctorController.js";

const doctorRouter = express.Router()

doctorRouter.get('/', getDoctors)
doctorRouter.get('/:id', getDoctorById)

export default doctorRouter