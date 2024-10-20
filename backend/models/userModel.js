const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your correct email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },

  twoFactorAuthCode: String,
  twoFactorAuthEnabled: { type: Boolean, default: false },
  refreshToken: { type: String }, // Thêm trường lưu refresh token
});

userSchema.methods.signShortJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SHORT_EXPIRES_IN,
  });
};

userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LONG_EXPIRES_IN,
  });
};

userSchema.methods.correctPassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
