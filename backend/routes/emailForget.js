const express = require("express");
const {
  sendMailController,
  getMailController,
  CodeEmailController,
} = require("../controllers/sendMailController.js");
const findEmailMiddleware = require("../middleware/findEmailMiddleware.js");
const router = express.Router();

router.get("/me", getMailController);
router.post("/forgetpassword", findEmailMiddleware, sendMailController);
router.post("/verifyCode", CodeEmailController);

module.exports = router;
