const jwt = require('jsonwebtoken');  // สำหรับถอดรหัส token
const User = require('../models/User');  // import User Model

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;  // ดึง token จาก header

        // ตรวจสอบว่า token มีอยู่ไหม
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        // 3. ดึง token ออกมา (ตัดคำว่า "Bearer " ออก)
        // "Bearer eyJhbGci..." → "eyJhbGci..."
        const token = authHeader.split(' ')[1];

        // 4. ถอดรหัส token ด้วย JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // 6. เก็บข้อมูล user ไว้ใน req.user เพื่อให้ route ถัดไปใช้ได้
        // เช่น req.user.id, req.user.username
        req.user = user;

        // 7. เรียก next() เพื่อไปยัง route ถัดไป
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        // ถ้า token หมดอายุหรือไม่ถูกต้อง
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
        }

        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ token' });
    }
}

module.exports = authMiddleware;
