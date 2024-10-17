const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Thay đổi `JWT_SECRET` thành bí mật của bạn
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next(); // Tiếp tục nếu xác thực thành công
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authMiddleware;
