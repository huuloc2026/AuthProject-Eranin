const express = require("express");
const router = express.Router();

// get all
router.get("/", (req, res) => {
  res.send("get all user");
});
// get user by id
router.get("/:id", (req, res) => {
  res.send("get user by ID");
});

module.exports = router;
