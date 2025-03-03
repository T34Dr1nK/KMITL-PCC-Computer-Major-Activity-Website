const jwt = require('jsonwebtoken');
async function testSys(req, res) {
  try {
    return res.status(200).json({ message: "HelloWorld" });
  } catch (err) {
    console.error(err);
  }
}
const testJWT = (req, res) => {
  res.json({
    message: "You have access!",
    user: req.user,
  });
};

const testgenToken = (req, res) => {
    try {
        const user = { id: "12345", email: "test@example.com" };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });
    } catch (error) {
        console.error("Error Generating Token:", error);
        res.status(500).json({ message: "Error Generating Token" });
    }
};

const imgtest = (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });

  } catch (error) {
    
    res.status(500).json({ message: "Error Uploading Image" });

  }

}

module.exports = { testSys, testJWT, testgenToken, imgtest };
