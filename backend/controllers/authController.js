const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const User = require("../models/userModel");
const TwoFactorError = require("../utils/TwoFactorError");

const cookieTokenResponse = (User, statusCode, res) => {
  const shortToken = User.signShortJwtToken();
  const longToken = User.signLongJwtToken();

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

  res
    .status(statusCode)
    .cookie("shortToken", shortToken, cookieOptions)
    .cookie("longToken", longToken, cookieOptions)
    .json({
      message: "Success register",
      shortToken,
      longToken,
      data: {
        User,
      },
    });
};
const generateSpeakeasySecretCode = () => {
  const secretCode = speakeasy.generateSecret({
    name: process.env.MFA_SECRET,
  });

  return {
    otpauthURL: secretCode.otpauth_url,
    base32: secretCode.base32,
  };
};
const returnQRCode = (data, res) => {
  // const stringData = new TextDecoder("utf-8").decode(data);

  QRCode.toFileStream(res, data, {
    type: "png",
  });
};

exports.generate2FACode = async (req, res, next) => {
  try {
    const token = req.cookies.longToken;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { otpauthURL, base32 } = generateSpeakeasySecretCode();
    console.log(decoded);
    await User.findOneAndUpdate(decoded.id, {
      twoFactorAuthCode: base32,
    });

    returnQRCode(otpauthURL, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.verify2FACode = async (req, res, next) => {
  const { token } = req.body;
  const cookieToken = req.cookies.longToken;
  const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuthCode,
    encoding: "base32",
    token,
  });

  if (verified) {
    await User.findOneAndUpdate(decoded.id, {
      twoFactorAuthEnabled: true,
    });
    cookieTokenResponse(user, 200, res);
  } else {
    res.json({
      verified: false,
    });
  }
};

exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists!",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    return cookieTokenResponse(newUser, 201, res);
  } catch (error) {
    if (
      error.name &&
      error.email &&
      error.confirmPassword === "ValidationError"
    ) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    next(error);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new TwoFactorError("Please provide and email and password!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new TwoFactorError("Incorrect email or password", 401));
  }

  return cookieTokenResponse(user, 200, res);
};

exports.logoutUser = async (req, res, next) => {
  res.cookie("longToken", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // Sửa lỗi này
    httpOnly: true,
  });
  res.status(200).json({ message: "success" });
};
