const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const acccessMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const token = req.header("Authorization").split(" ")[1]; // Sử dụng optional chaining

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng dựa trên ID trong token
    req.user = await User.findById(decoded.id);
    if (!req.user.twoFactorAuthEnabled) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next(); // Tiếp tục nếu xác thực thành công
  } catch (error) {
    res.status(401).json({
      message: "Not authorized ! Token Expired",
      error: error.message,
    });
  }
};

module.exports = acccessMiddleware;
