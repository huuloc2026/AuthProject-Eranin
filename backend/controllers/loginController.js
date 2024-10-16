const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
// Hàm đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo short-lived token (hết hạn sau 1 giờ)
    const shortLivedToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Thời gian hết hạn là 1 giờ
      }
    );

    // Tạo long-lived token (hết hạn sau 30 ngày)
    const longLivedToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // Thời gian hết hạn là 30 ngày
      }
    );

    // Nếu đăng nhập thành công
    res.status(200).json({
      message: "Login successful",
      user: { username: user.username },
      tokens: {
        shortLivedToken,
        longLivedToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
