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
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({ token });
    } catch (error) {
        console.error("Error Generating Token:", error);
        res.status(500).json({ message: "Error Generating Token" });
    }
};

module.exports = { testSys, testJWT, testgenToken };
