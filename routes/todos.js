const express = require('express');
const Todo = require('../models/Todo');              // import Todo Model
const authMiddleware = require('../middleware/authMiddleware');  // import Auth Middleware

// สร้าง Router
const router = express.Router();

// ใช้ authMiddleware กับทุก route หรือ API ใน file นี้
// หมายความว่าทุก route ต้อง login ก่อนถึงจะใช้ได้
router.use(authMiddleware);

// POST /api/todos - สร้าง Todo ใหม่
router.post('/', async (req, res) => {
    try {
        // 1. รับข้อมูลจาก request body หรือจากฝั่งหน้าเว็บ (Frontend)
        const { title, description } = req.body;

        // 2. ตรวจสอบว่ามี title (ชื่อของงานที่ต้องการจะทำ) ไหม
        if (!title) {
            return res.status(400).json({
                message: 'กรุณากรอกชื่องาน (title)'
            });
        }

        // 3. สร้าง Todo ใหม่
        // req.user มาจาก authMiddleware (ข้อมูล user ที่ login) 
        const todo = new Todo({
            title,
            description: description || '',
            user: req.user._id  // เชื่อมกับ user ที่ login
        });

        // 4. บันทึกลง Database
        await todo.save();

        // 5. ส่งผลลัพธ์กลับ
        res.status(201).json({
            message: 'สร้าง Todo สำเร็จ!',
            todo
        });

    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// GET /api/todos - ดึง Todo ทั้งหมดของ user
router.get('/', async (req, res) => {
    try {
        // หา Todo ทั้งหมดที่ user เป็นเจ้าของ
        // .sort({ createdAt: -1 }) = เรียงจากใหม่ไปเก่า
        const todos = await Todo.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            count: todos.length,
            todos
        });

    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// GET /api/todos/:id - ดึง Todo ระบุเฉพาะ id นั้นๆ
router.get('/:id', async (req, res) => {
    try {
        // หา Todo จาก id และต้องเป็นของ user ที่ login เท่านั้น
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                message: 'ไม่พบ Todo นี้'
            });
        }

        res.json(todo);

    } catch (error) {
        console.error('Get todo error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// PUT /api/todos/:id - แก้ไข Todo
router.put('/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        // หา Todo และอัปเดต
        // { new: true } = ส่งค่าใหม่กลับมา (ไม่ใช่ค่าเก่า)
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },  // เงื่อนไข: id ตรง และเป็นของ user
            { title, description, completed },            // ข้อมูลที่จะอัปเดต
            { new: true, runValidators: true }            // options
        );

        if (!todo) {
            return res.status(404).json({
                message: 'ไม่พบ Todo นี้'
            });
        }

        res.json({
            message: 'อัปเดต Todo สำเร็จ!',
            todo
        });

    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// DELETE /api/todos/:id - ลบ Todo แบบระบุเฉพาะ id
router.delete('/:id', async (req, res) => {
    try {
        // หา Todo และลบ
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                message: 'ไม่พบ Todo นี้'
            });
        }

        res.json({
            message: 'ลบ Todo สำเร็จ!',
            todo
        });

    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
    }
});

// Export router
module.exports = router;
