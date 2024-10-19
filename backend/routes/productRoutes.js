const express = require("express");
const router = express.Router();

const exampleProducts = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: 100000,
    description: "Mô tả sản phẩm 1",
    voucher: {
      code: "VOUCHER10",
      discount: 10, // Giảm 10%
      validUntil: "2024-12-31",
    },
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: 200000,
    description: "Mô tả sản phẩm 2",
    voucher: {
      code: "VOUCHER20",
      discount: 20, // Giảm 20%
      validUntil: "2024-11-30",
    },
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: 150000,
    description: "Mô tả sản phẩm 3",
    voucher: {
      code: "VOUCHER15",
      discount: 15, // Giảm 15%
      validUntil: "2024-12-15",
    },
  },
  {
    id: 4,
    name: "Sản phẩm 4",
    price: 250000,
    description: "Mô tả sản phẩm 4",
    voucher: {
      code: "VOUCHER25",
      discount: 25, // Giảm 25%
      validUntil: "2024-10-31",
    },
  },
  {
    id: 5,
    name: "Sản phẩm 5",
    price: 300000,
    description: "Mô tả sản phẩm 5",
    voucher: {
      code: "VOUCHER30",
      discount: 30, // Giảm 30%
      validUntil: "2025-01-01",
    },
  },
  {
    id: 6,
    name: "Sản phẩm 6",
    price: 400000,
    description: "Mô tả sản phẩm 6",
    voucher: {
      code: "VOUCHER40",
      discount: 40, // Giảm 40%
      validUntil: "2024-09-30",
    },
  },
  {
    id: 7,
    name: "Sản phẩm 7",
    price: 180000,
    description: "Mô tả sản phẩm 7",
    voucher: {
      code: "VOUCHER18",
      discount: 18, // Giảm 18%
      validUntil: "2024-11-15",
    },
  },
  {
    id: 8,
    name: "Sản phẩm 8",
    price: 220000,
    description: "Mô tả sản phẩm 8",
    voucher: {
      code: "VOUCHER22",
      discount: 22, // Giảm 22%
      validUntil: "2024-12-20",
    },
  },
  {
    id: 9,
    name: "Sản phẩm 9",
    price: 270000,
    description: "Mô tả sản phẩm 9",
    voucher: {
      code: "VOUCHER27",
      discount: 27, // Giảm 27%
      validUntil: "2024-10-25",
    },
  },
  {
    id: 10,
    name: "Sản phẩm 10",
    price: 320000,
    description: "Mô tả sản phẩm 10",
    voucher: {
      code: "VOUCHER32",
      discount: 32, // Giảm 32%
      validUntil: "2025-02-14",
    },
  },
];
const acccessMiddleware = require("../middleware/acccessMiddleware");
router.get("/listvoucher", acccessMiddleware, async (req, res) => {
  try {
    res.status(200).json(exampleProducts); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
