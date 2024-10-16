const express = require("express");
const { login } = require("../controllers/loginController");
const { register } = require("../controllers/registerController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;

// router.post("/login", authController.login);
// router.post("/mfa", authController.verifyMFA);
