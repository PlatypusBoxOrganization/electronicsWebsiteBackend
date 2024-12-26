const express = require("express");
const { addToCart } = require("../controllers/cart");
const { getCart } = require("../controllers/cart");
const router = express.Router();
// Route to fetch the cart for a specific user
router.get("/:userId", getCart);

router.post("/", addToCart);

module.exports = router;
