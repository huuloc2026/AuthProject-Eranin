const TwoFactorError = require("../utils/TwoFactorError");

const mongooseErrorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}. This resource doesn't exist`;
    error = new TwoFactorError(message, 404);
  }

  if (err.code === 11000) {
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const value = match ? match[0] : "Unknown value"; // Kiểm tra match có không
    const message = `Duplicate field value: ${value}. Please enter another value`;
    error = new TwoFactorError(message, 400);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new TwoFactorError(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error,
    message: error.message,
  });
};

module.exports = mongooseErrorHandler;
