const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
const { authRoutes } = require("./routes/index.js");
const PORT = process.env.PORT || 8888;
const connection = require("./config/config.js");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const User = mongoose.model("User", userSchema);
const admin = new User({ username: "huuloc", password: "123456" });
// admin.save();
console.log(admin.username); // 'Silence'

//test connection;
(async () => {
  try {
    await connection();

    app.listen(PORT, () => {
      console.log(`Backend zero app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(">>>>>error", error);
  }
})();
