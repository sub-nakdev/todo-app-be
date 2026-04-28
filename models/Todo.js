const mongoose = require('mongoose');

// สร้าง Schema สำหรับ Todo
// Todo แต่ละอันจะมี field เหล่านี้
const todoSchema = new mongoose.Schema({
    // title: ชื่องานที่ต้องทำ
    title: {
        type: String,           // ประเภทข้อมูลเป็นตัวอักษร ตัวเลข และสัญลักษณ์พิเศษ 
        required: true,          // จำเป็นต้องมี (ห้ามว่าง หรือห้ามไม่ส่งข้อมูลนี้มา ต้องส่งมาเท่านั้น) 
        trim: true              // ตัดช่องว่างหน้า-หลังออก
    },

    // description: รายละเอียดของงาน (ไม่บังคับ)
    description: {
        type: String,
        trim: true,
        default: ''             // ถ้าไม่กรอกข้อมูลมา จะเป็นค่าว่าง
    },

    // completed: งานเสร็จแล้วหรือยัง
    completed: {
        type: Boolean,          // ประเภทข้อมูลเป็น true/false
        default: false          // ค่าเริ่มต้นคือ false (งานยังไม่เสร็จ) 
    },

    // user: เจ้าของ Todo นี้ (อ้างอิงไปยัง User Model)
    // ทำให้แต่ละคนเห็นเฉพาะ Todo ของตัวเอง
    user: {
        type: mongoose.Schema.Types.ObjectId,  // ประเภทเป็น ObjectId
        ref: 'User',                            // อ้างอิงไปยัง User Model
        required: true                          // จำเป็นต้องมี (ห้ามว่าง หรือห้ามไม่ส่งข้อมูลนี้มา ต้องส่งมาเท่านั้น)
    }
}, {
    // Options เพิ่มเติม
    timestamps: true   // เพิ่ม createdAt และ updatedAt อัตโนมัติ (เวลาที่สร้างและเวลาที่อัปเดตล่าสุด)
});

// สร้าง Model จาก Schema
const Todo = mongoose.model('Todo', todoSchema);

// Export ออกไปให้ไฟล์อื่นใช้ได้
module.exports = Todo;
