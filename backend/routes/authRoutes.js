import express from "express";
import { adminLogin } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router()

authRouter.post('/login', adminLogin)
authRouter.get('/admin', authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the protected user route!", user: req.admin })
})

export default authRouter