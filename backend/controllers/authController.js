import adminModel from "../models/adminModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// API for admin login
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password required" })
        }

        const admin = await adminModel.findOne({username})
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid username or password" })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password" })
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1min' }
        )

        res.status(200).json({ success: true, token })
    } catch (error) {
        console.log('Login error: ', error);
        res.json({ success: false, message: error.message });
    }
}