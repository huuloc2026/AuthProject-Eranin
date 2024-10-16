const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
//
const authenticate = (req, res, next) => {
  // Lấy token từ header
  const token = req.header("token");
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
