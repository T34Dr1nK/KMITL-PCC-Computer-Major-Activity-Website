const connection = require("./dbconn");  // เชื่อมต่อกับฐานข้อมูล

const InsertService = {
  insertData: async (data) => {
    return new Promise((resolve, reject) => {
      // ตรวจสอบข้อมูลว่ามีครบถ้วนหรือไม่
      const { ACT_Name, ACT_DESC, DATE_MADE, Place, Cover_Picture, Pin, TYPE_ID, Advisor } = data;
      
      if (!ACT_Name || !ACT_DESC || !DATE_MADE || !Place || !Cover_Picture || Pin === undefined || !TYPE_ID || !Advisor) {
        return reject({ message: "All fields are required" });  // ถ้ามีฟิลด์ไหนขาดหายไป
      }

      // คำสั่ง SQL ที่จะใช้สำหรับเพิ่มข้อมูล (ไม่ต้องใส่ ACT_ID เพราะมัน AUTO_INCREMENT)
      const sql = `
        INSERT INTO Activity (ACT_Name, ACT_DESC, DATE_MADE, Place, Cover_Picture, Pin, TYPE_ID, Advisor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      // ใช้คำสั่ง SQL เพื่อเพิ่มข้อมูลลงในฐานข้อมูล
      connection.query(sql, [ACT_Name, ACT_DESC, DATE_MADE, Place, Cover_Picture, Pin, TYPE_ID, Advisor], (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return reject(err);  // หากมีข้อผิดพลาดให้ reject
        }
        resolve({
          message: "Data inserted successfully",
          result: results // results จะมี insertId และ affectedRows
        });
      });
    });
  },
};

module.exports = InsertService;