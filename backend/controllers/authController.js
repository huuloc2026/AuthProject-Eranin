const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel"); // Đảm bảo đường dẫn đúng

// Hàm xác minh MFA
const verifyMFA = async (req, res) => {
  // Logic để xác minh MFA (ví dụ: kiểm tra mã gửi đến người dùng)
  // Placeholder cho xác minh MFA
  res.send("MFA verification endpoint");
};

module.exports = { verifyMFA };
