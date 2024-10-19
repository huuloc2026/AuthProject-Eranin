const express = require("express");

// const {
//   registerUser,
//   login,

//   logoutUser,
//   generate2FACode,
//   verify2FACode,
// } = require("../controllers/authController");
// const router = express.Router();

// //

// router.post("/register", registerUser);
// router.post("/login", login);
// router.get("/logout", logoutUser);
// router.post("/2fa/generate", generate2FACode);
// router.post("/2fa/verify", verify2FACode);

///
const { login, registerUser } = require("../controllers/testAuthChatGPT");
const router = express.Router();

const testMiddleware = require("../middleware/middlewareTest");
const {
  generate2FACode,
  verify2FACode,
} = require("../controllers/authController");
//

router.post("/login", login);
router.post("/register", registerUser);
router.post("/2fa/generate", generate2FACode);
router.post("/2fa/verify", verify2FACode);

///

module.exports = router;
