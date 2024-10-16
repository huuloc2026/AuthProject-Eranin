const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const User = require("../backend/models/userModel.js");
const app = express();
const { authRoutes, productRoutes } = require("./routes/index.js");
const PORT = process.env.PORT || 8888;
const connection = require("./config/config.js");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Uncaught Exception
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception....💣 🔥 stopping the server...");
  console.log(error.name, error.message);
  process.exit(1);
});

//test connection;
(async () => {
  try {
    await connection();

    app.listen(PORT, () => {
      console.log(`Backend zero app listening on port ${PORT}`);
    });
    process.on("unhandledRejection", (error) => {
      console.log("Unhandled Rejection....💣 🔥 stopping the server...");
      console.log(error.name, error.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.log(">>>>>error", error);
  }
})();
