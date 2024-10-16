const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const cookieTokenResponse = (User, statusCode, res) => {
  const token = User.signJwtToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  User.password = undefined;
  User.twoFactorAuthCode = undefined;

  res.status(statusCode).cookie("facade", token, cookieOptions).json({
    message: "success register",
    token,
    data: {
      User,
    },
  });
};

module.exports = { cookieTokenResponse };
