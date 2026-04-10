import express from "express";
import { timeslots } from "../controllers/timeslotController.js";

const timeslotRouter = express.Router()

timeslotRouter.get('/', timeslots)

export default timeslotRouter