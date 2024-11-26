const Product = require("../models/product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Product created successfully",
        product,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
  }
};

// Get product details by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching product details",
        error: error.message,
      });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting product",
        error: error.message,
      });
  }
};


exports.getProductByFilter = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort } = req.query;

    // Step 1: Build the query object
    const query = {};
    if (category) query.category = category;

    // Step 2: Handle pagination
    const skip = (page - 1) * limit;

    // Step 3: Build the sort object with a fallback default
    let sortObject = { price: 1 }; // Default to price ascending
    if (sort) {
      if (sort === "price_asc") sortObject = { price: 1 };
      else if (sort === "price_desc") sortObject = { price: -1 };
      else if (sort === "rating_asc") sortObject = { rating: 1 };
      else if (sort === "rating_desc") sortObject = { rating: -1 };
    }

    // Step 4: Log the query, skip, and limit for debugging
    console.log("Query:", query);
    console.log("Sort Object:", sortObject);
    console.log("Skip:", skip);
    console.log("Limit:", limit);

    // Step 5: Query the database
    const products = await Product.find(query)
      .sort(sortObject) // Apply sorting
      .skip(skip) // Apply pagination
      .limit(Number(limit));

    // Step 6: Return metadata
    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};