const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const findEmailMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng dựa trên ID trong token
    const userMiddleware = await User.findById(decoded.id);

    req.user = userMiddleware.randomCodePassWord;
    console.log(req.user);

    next(); // Tiếp tục nếu xác thực thành công
  } catch (error) {
    res.status(401).json({
      message: "Not authorized ! Token Expired",
      error: error.message,
    });
  }
};

module.exports = findEmailMiddleware;
