const User = require("../models/userModel");

exports.refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Kiểm tra xem refresh token có tồn tại không
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not found" });
  }

  try {
    // Kiểm tra refresh token trong DB
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Tạo access token mới
    const newAccessToken = user.signShortJwtToken();

    // Trả về access token mới
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
