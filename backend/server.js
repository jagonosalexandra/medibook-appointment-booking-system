import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import doctorRouter from "./routes/doctorRoute.js";
import timeslotRouter from "./routes/timeslotRoute.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173', // user-side
        'http://localhost:5174', // admin
    ]
}))

// api endpoint
app.use('/api/doctors', doctorRouter)
app.use('/api/timeslots', timeslotRouter)
app.use('/api/appointments', appointmentRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log("Server started", port))


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred' });
})