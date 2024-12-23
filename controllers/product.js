const Product = require("../models/product");

// exports.createProduct = async (req, res) => {
//   try {
//     // Validate images
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one image is required",
//       });
//     }

//     // Map uploaded files to the images field
//     const images = req.files.map((file, index) => ({
//       url: file.path,
//       alt: req.body.alt || `Image ${index + 1}`,
//       order: index + 1,
//     }));

//     // Parse numeric fields to ensure correct data type
//     const {
//       price,
//       discountPercentage,
//       stock,
//       rating,
//       numReviews,
//       ...restBody
//     } = req.body;

//     const parsedData = {
//       ...restBody,
//       price: parseFloat(price),
//       discountPercentage: parseFloat(discountPercentage) || 0,
//       stock: parseInt(stock, 10),
//       rating: parseFloat(rating) || undefined,
//       numReviews: parseInt(numReviews, 10) || 0,
//       images,
//     };

//     // Validate required fields
//     const requiredFields = ["name", "brand", "price", "stock", "category"];
//     for (const field of requiredFields) {
//       if (!parsedData[field]) {
//         return res.status(400).json({
//           success: false,
//           message: `${field} is required`,
//         });
//       }
//     }

//     // Create and save the product
//     const product = new Product(parsedData);
//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating product",
//       error: error.message,
//     });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Map uploaded files to the ImagesArray field
    const ImagesArray = req.files.map((file, index) => ({
      url: file.path,
      alt: req.body.alt || `Image ${index + 1}`,
      order: index + 1,
    }));

    // Parse numeric fields to ensure correct data type
    const {
      item_prize,
      item_discountPercentile,
      item_buyAmount,
      item_rating,
      ...restBody
    } = req.body;

    const parsedData = {
      ...restBody,
      item_prize: parseFloat(item_prize),
      item_discountPercentile: parseFloat(item_discountPercentile) || 0,
      item_buyAmount: parseInt(item_buyAmount, 10) || 0,
      item_rating: parseFloat(item_rating) || undefined,
      ImagesArray,
    };

    // Validate required fields
    const requiredFields = [
      "item_name",
      "item_categoryTag",
      "item_prize",
      "item_rating",
    ];
    for (const field of requiredFields) {
      if (!parsedData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // Create and save the product
    const product = new Product(parsedData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
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

