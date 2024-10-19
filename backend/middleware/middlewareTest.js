// const jwt = require("jsonwebtoken");
// const axios = require("axios");

// const checkAccessToken = async (req, res, next) => {
//   const token = req.cookies.refreshToken; // Lấy refresh token từ cookie

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     // Kiểm tra access token từ header
//     const accessToken = req.header("Authorization").split(" ")[1];

//     if (!accessToken) {
//       return res.status(401).json({ message: "No access token provided" });
//     }

//     // Kiểm tra xem access token còn hợp lệ không
//     jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         // Nếu token hết hạn, gọi endpoint refreshAccessToken
//         return axios
//           .post(
//             `${process.env.API_URL}/refreshAccessToken`,
//             {},
//             { withCredentials: true }
//           )
//           .then((response) => {
//             // Gán access token mới vào header
//             req.header("Authorization", `Bearer ${response.data.accessToken}`);
//             next();
//           })
//           .catch((refreshError) => {
//             return res
//               .status(401)
//               .json({ message: "Could not refresh access token" });
//           });
//       }

//       // Nếu token còn hiệu lực
//       req.user = decoded; // Lưu thông tin người dùng vào req.user
//       next();
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = checkAccessToken;
