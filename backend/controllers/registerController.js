const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const register = async (req, res) => {
  const { username, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser && phone) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { register };
