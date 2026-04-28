const express = require('express');
const bcrypt = require('bcryptjs');      // สำหรับเข้ารหัส password
const jwt = require('jsonwebtoken');     // สำหรับสร้าง token
const User = require('../models/User');  // import User Model ที่สร้างไว้

// สร้าง Router (ตัวจัดการ routes แยก)
const router = express.Router();

// POST /api/auth/register - สมัครสมาชิก
router.post('/register', async (req, res) => {
    try {
        // 1. รับข้อมูลจาก request body จากฝั่งหน้าเว็บ (Frontend)
        const { username, email, password } = req.body;

        // 2. ตรวจสอบว่ากรอกข้อมูลมาครบไหม ถ้าไม่ครบให้ส่ง error กลับไป
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'กรุณากรอกข้อมูลให้ครบ (username, email, password)'
            });
        }

        // 3. ตรวจสอบว่า email หรือ username ซ้ำไหม
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]  // หา email หรือ username ที่ตรงกัน
        });

        // ถ้ามี user ที่มี email หรือ username ซ้ำ ให้ส่ง error กลับไป
        if (existingUser) {
            return res.status(400).json({
                message: 'Email หรือ Username นี้มีคนใช้แล้ว'
            });
        }

        // 4. เข้ารหัส password ก่อนบันทึก (ห้ามเก็บ password ตรงๆ!)
        // bcrypt.hash(password, 10) = เข้ารหัสด้วยการสุ่มตัวเลข 10 ครั้ง
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. สร้าง account user ใหม่และบันทึกลง Database
        const user = new User({
            username,
            email,
            password: hashedPassword  // เก็บ password ที่เข้ารหัสแล้ว
        });
        await user.save();  // บันทึกลง MongoDB

        // 6. ส่งข้อมูลกลับไปให้ทางฝั่งหน้าเว็บ (Frontend) (ไม่ส่ง password กลับ!)
        res.status(201).json({
            message: 'สมัครสมาชิกสำเร็จ!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

        // 7. ถ้ามี error ให้ส่ง error กลับไปให้ทางฝั่งหน้าเว็บ (Frontend)
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// POST /api/auth/login - เข้าสู่ระบบ
router.post('/login', async (req, res) => {
    try {
        // 1. รับข้อมูลจาก request body จากฝั่งหน้าเว็บ (Frontend)
        const { email, password } = req.body;

        // 2. ตรวจสอบว่ากรอกข้อมูลครบไหม ถ้าไม่ครบให้ส่ง error กลับไป
        if (!email || !password) {
            return res.status(400).json({
                message: 'กรุณากรอก email และ password'
            });
        }

        // 3. หา user จาก email ที่กรอกมา ถ้าไม่เจอให้ส่ง error กลับไป
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Email หรือ Password ไม่ถูกต้อง'
            });
        }

        // 4. เปรียบเทียบ password ที่กรอกกับที่เข้ารหัสไว้
        // bcrypt.compare() จะเปรียบเทียบให้อัตโนมัติ ถ้าไม่ตรงให้ส่ง error กลับไป
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Email หรือ Password ไม่ถูกต้อง'
            });
        }

        // 5. สร้าง JWT Token
        // jwt.sign(ข้อมูลที่จะเก็บใน token, secret key, options)
        const token = jwt.sign(
            { userId: user._id },           // ข้อมูลที่เก็บใน token
            process.env.JWT_SECRET,         // secret key จาก .env
            { expiresIn: '7d' }             // token หมดอายุใน 7 วัน
        );

        // 6. ส่ง token กลับให้ client เก็บไว้
        res.json({
            message: 'เข้าสู่ระบบสำเร็จ!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        // 7. ถ้ามี error ให้ส่ง error กลับไปให้ทางฝั่งหน้าเว็บ (Frontend)
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

module.exports = router;
