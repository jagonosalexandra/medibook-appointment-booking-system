import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" })
    }
}

export default authMiddleware 