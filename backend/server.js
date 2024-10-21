const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("../backend/routes/productRoutes.js");
const emailForgetRoutes = require("../backend/routes/emailForget.js");

dotenv.config();

const PORT = process.env.PORT || 8888;
const connection = require("./config/config.js");
const app = express();
app.use(cors({ credentials: true }));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/email", emailForgetRoutes);

//test connection;
(async () => {
  try {
    await connection();
    app.listen(PORT, () => {
      console.log(`=> App listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(">>>>>Error connecting to the database:", error);
  }
})();
