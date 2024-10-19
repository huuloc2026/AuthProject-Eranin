const User = require("../models/userModel"); // Đảm bảo import mô hình User
const bcrypt = require("bcrypt");
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
    await user.save();

    // Cài đặt cookie cho refresh token (nếu bạn muốn)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    });

    // Trả về response
    res.status(200).json({
      message: "Login successful",
      accessToken,
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
