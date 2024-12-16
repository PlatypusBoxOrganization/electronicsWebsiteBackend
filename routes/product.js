const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductByFilter } = require("../controllers/product")
const upload = require("../multerConfig");
// Routes
router.post(
  "/",
  upload.array("images", 5), // Maximum of 5 images
  createProduct
);
router.get("/", getAllProducts);
router.get("/filter", getProductByFilter);
router.get("/:id", getProductById);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
module.exports = router;
