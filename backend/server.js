const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("../backend/routes/productRoutes.js");
const PORT = process.env.PORT || 8888;
const connection = require("./config/config.js");
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

//test connection;
(async () => {
  try {
    await connection();
    app.listen(PORT, () => {
      console.log(`=> App listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(">>>>>error", error);
  }
})();
