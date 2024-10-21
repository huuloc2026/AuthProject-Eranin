const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");
const User = require("../models/userModel");

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
const randomCodePassWord = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.generate2FACode = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
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

  if (!token) {
    return res.status(400).json({ message: "2FA code is required" });
  }

  const cookieToken = req.headers.authorization.split(" ")[1];

  if (!cookieToken) {
    return res.status(400).json({ message: "Access token not found" });
  }

  try {
    // Giải mã access token
    const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);

    // Tìm người dùng theo ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xác thực mã 2FA
    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorAuthCode,
      encoding: "base32",
      token,
    });
    console.log(isVerified);
    if (!isVerified) {
      return res
        .status(400)
        .json({ verified: false, message: "Invalid 2FA code" });
    }

    // Cập nhật trạng thái 2FA cho người dùng
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { twoFactorAuthEnabled: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    return res.status(200).json({ message: "2FA verification successful" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid access token" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("Please provide an email and password!", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password))) {
      return next(new Error("Incorrect email or password", 401));
    }

    // Tạo access token và refresh token
    const accessToken = user.signShortJwtToken();
    const refreshToken = user.signRefreshToken();

    // Lưu refresh token vào cơ sở dữ liệu
    user.refreshToken = refreshToken;
    user.randomCodePassWord = randomCodePassWord(1, 10000000);

    await user.save();

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //   ),
    // });

    // Trả về response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        twoFactorAuthEnabled: user.twoFactorAuthEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email đã tồn tại!",
      });
    }

    // Kiểm tra xem mật khẩu có khớp không
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Mật khẩu không khớp!",
      });
    }

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password,
    });

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Lưu người dùng
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error); // Log lỗi để kiểm tra
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    next(error); // Chuyển lỗi cho middleware xử lý lỗi
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    res.clearCookie("refreshToken");
  }

  res.status(200).json({ message: "Logged out" });
};

exports.requestRefreshToken = async (req, res, next) => {
  // console.log("Received refresh token request");
  // Kiểm tra xem header authorization có tồn tại không
  const authorizationHeader = req.headers.authorization;

  // Nếu header không có, trả về lỗi 401
  if (!authorizationHeader) {
    return res.status(401).json("You're not authenticated");
  }

  // Lấy refresh token từ header
  const refreshToken = authorizationHeader.split(" ")[1];
  console.log(">>>>>RefreshTokenTest>>>>>>>>>>>>>", refreshToken);

  if (!refreshToken) {
    return res.status(401).json("You're not authenticated");
  }

  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const user = await User.findById(userData.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const accessToken = user.signShortJwtToken(); // Gọi phương thức trên instance người dùng

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error); // Log lỗi để dễ dàng gỡ lỗi
    return res.status(403).json("Refresh token is not valid");
  }
};
