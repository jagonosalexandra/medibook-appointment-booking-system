import express from "express";
import { doctors } from "../controllers/doctorController.js";

const doctorRouter = express.Router()

doctorRouter.get('/doctors', doctors)

export default doctorRouter