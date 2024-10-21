const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendEmailService } = require("../utils/EmailService.js");
exports.sendMailController = async (req, res) => {
  try {
    const code = req.user;

    const { email } = req.body;

    if (email) {
      const response = await sendEmailService(email, code);
      return res.status(201).json(response);
    }
    return res.status(500).json({ message: "the email is required" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getMailController = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Tìm người dùng dựa trên ID trong token
    req.user = await User.findById(decoded.id);
    // console.log(req.user);
    res.status(201).json({ email: req.user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.CodeEmailController = async (req, res, next) => {
  try {
    // Lấy mã xác thực từ request body
    const code = req.body.token;
    // Lấy access token từ header
    const token = req.headers.authorization.split(" ")[1];

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      return res.status(400).json({ message: "Access token not found" });
    }

    // Giải mã token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng dựa trên ID trong token
    const user = await User.findById(decoded.id);

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { twoFactorAuthEnabled: true },
      { new: true }
    );

    const codeVerified = updatedUser.randomCodePassWord;

    // So sánh mã xác thực
    if (codeVerified == +code) {
      return res.status(201).json({ code: codeVerified, message: "Success!!" });
    } else {
      return res.status(400).json({ message: "Invalid Code" });
    }
  } catch (error) {
    // Quản lý lỗi chi tiết hơn
    console.error("Error in CodeEmailController:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
