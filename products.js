const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Get all products
router.get("/products", productController.getProducts);

// Add a new product
router.post("/products", productController.addProduct);

module.exports = router;
