const mongoose = require('mongoose');

// สร้าง Schema สำหรับ User
// Schema = โครงสร้างข้อมูลที่บอกว่า User ต้องมี field อะไรบ้าง
const userSchema = new mongoose.Schema({
    // username: ชื่อผู้ใช้
    username: {
        type: String,           // ประเภทข้อมูลเป็น ตัวอักษร ตัวเลข และสัญลักษณ์พิเศษ
        required: true,         // จำเป็นต้องมี (ห้ามว่าง หรือห้ามไม่ส่งข้อมูลนี้มา ต้องส่งมาเท่านั้น)
        unique: true,           // ห้ามซ้ำกับคนอื่น
        trim: true,             // ตัดช่องว่างหน้า-หลังออก        
        minlength: 3            // ต้องมีอย่างน้อย 3 ตัวอักษร
    },

    // email: อีเมลของผู้ใช้
    email: {
        type: String,           // ประเภทข้อมูลเป็น ตัวอักษร ตัวเลข และสัญลักษณ์พิเศษ
        required: true,         // จำเป็นต้องมี (ห้ามว่าง หรือห้ามไม่ส่งข้อมูลนี้มา ต้องส่งมาเท่านั้น)
        unique: true,           // ห้ามซ้ำกับคนอื่น
        trim: true,             // ตัดช่องว่างหน้า-หลังออก
        lowercase: true         // แปลงเป็นตัวพิมพ์เล็กเสมอ
    },

    // password: รหัสผ่าน (จะเข้ารหัสก่อนบันทึก)
    password: {
        type: String,           // ประเภทข้อมูลเป็น ตัวอักษร ตัวเลข และสัญลักษณ์พิเศษ
        required: true,         // จำเป็นต้องมี (ห้ามว่าง หรือห้ามไม่ส่งข้อมูลนี้มา ต้องส่งมาเท่านั้น)
        minlength: 6            // รหัสผ่านต้องมีอย่างน้อย 6 ตัว
    }
}, {
    // Options เพิ่มเติม
    timestamps: true            // เพิ่ม createdAt และ updatedAt อัตโนมัติ (เวลาที่สร้างและเวลาที่อัปเดตล่าสุด)
});

// สร้าง Model จาก Schema
// Model = ตัวที่ใช้ติดต่อกับ Database จริงๆ
const User = mongoose.model('User', userSchema);

// Export ออกไปให้ไฟล์อื่นใช้ได้
module.exports = User;
