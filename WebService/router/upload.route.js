const express = require("express");
const upload = require("../Middleware/upload.js"); // Import multer middleware
const { uploadActivity } = require("../controller/upload.controller.js");
const InsertService = require('../services/insert.service.js');

const router = express.Router();
// Upload route (Handles Cover_Picture and multiple Picture uploads)
router.post("/", upload.fields([
    { name: "Cover_Picture", maxCount: 1 },  // Single cover image
    { name: "Picture", maxCount: 5 } // Multiple pictures (max 5)
]), uploadActivity);
router.post("/upload", uploadActivity);

router.post('/upload', async (req, res) => {
    try {
      // รับข้อมูล JSON จาก body ของคำขอ
      const data = req.body;
  
      // เรียกใช้ฟังก์ชัน insertData เพื่อเพิ่มข้อมูลลงในฐานข้อมูล
      const result = await InsertService.insertData(data);
  
      // ส่งผลลัพธ์กลับไปว่าเพิ่มข้อมูลสำเร็จ
      res.status(200).json({ message: 'Data inserted successfully', result });
    } catch (error) {
      console.error('Error during insert:', error);
      res.status(500).json({ message: 'Failed to insert data', error });
    }
  });

module.exports = router;