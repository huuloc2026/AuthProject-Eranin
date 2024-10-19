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
    httpOnly: false,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  User.password = undefined;
  User.twoFactorAuthCode = undefined;

  res.status(statusCode).json({
    message: "Success",
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
const returnQRCode = async (data, res) => {
  // const stringData = new TextDecoder("utf-8").decode(data);

  QRCode.toFileStream(res, data, {
    type: "png",
  });

  //URL Image

  // try {
  //   const qrCodeImage = await QRCode.toDataURL(data); // Tạo ảnh QR dưới dạng data URL
  //   res.status(200).json({ qrCodeImage }); // Trả về ảnh QR trong phản hồi
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Error generating QR code" });
  // }
};

exports.generate2FACode = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    console.log(token);
    console.log("req.cookies", req.cookies.refreshToken);
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { otpauthURL, base32 } = generateSpeakeasySecretCode();
    await User.findOneAndUpdate(
      { _id: decoded.id },
      { twoFactorAuthCode: base32 },
      { new: true } // Để trả về tài liệu đã cập nhật
    );

    returnQRCode(otpauthURL, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.verify2FACode = async (req, res, next) => {
  const { token } = req.body;

  console.log(req.cookies);

  const cookieToken = req.headers.authorization.split(" ")[1];

  if (!cookieToken) {
    return res.status(400).json({ message: "Token not found" });
  }

  let decoded;
  try {
    decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await User.findById(decoded.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuthCode,
    encoding: "base32",
    token,
  });

  if (verified) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: decoded.id },
        {
          twoFactorAuthEnabled: true,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }

      return res.status(200).json({
        message: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ verified: false, message: "Invalid 2FA code" });
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
///

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
  res.cookie("shortToken", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000), // Sửa lỗi này
    httpOnly: true,
  });
  res.cookie("longToken", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000), // Sửa lỗi này
    httpOnly: true,
  });
  res.status(200).json({ message: "success" });
};
