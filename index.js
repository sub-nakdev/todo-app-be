const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');            // สำหรับให้ Frontend เรียก API ได้
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');  // นำเข้า auth routes
const todoRoutes = require('./routes/todos'); // นำเข้า todo routes

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
});

// สร้าง Express App
const app = express();

// Middleware (ทำงานก่อน routes) 
app.use(cors());              // อนุญาตให้ Frontend เรียก API ได้
app.use(express.json());      // แปลง JSON body เป็น object

// Routes (API Endpoints)
// ใช้ auth routes โดยมี prefix เป็น /api/auth
// เช่น POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', authRoutes);

// ใช้ todo routes โดยมี prefix เป็น /api/todos
// เช่น GET /api/todos, POST /api/todos
app.use('/api/todos', todoRoutes);

// Route ทดสอบว่า server ทำงาน
app.get('/', (req, res) => {
    res.json({ message: 'Todo API Server is running! 🚀' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

