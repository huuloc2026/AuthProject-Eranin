const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const login = async (req, res) => {
  res.send("Hello");
};

module.exports = { login };

// exports.verifyMFA = async (req, res) => {
//   // Logic to verify MFA (e.g., checking a code sent to the user)
//   // Placeholder for MFA verification
//   res.send("MFA verification endpoint");
// };
