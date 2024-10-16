const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const User = require("../backend/models/userModel.js");
const app = express();
const { authRoutes, productRoutes } = require("./routes/index.js");
const PORT = process.env.PORT || 8888;
const connection = require("./config/config.js");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

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
