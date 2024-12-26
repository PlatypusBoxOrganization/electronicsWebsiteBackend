const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Update the quantity of the existing product
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add the product to the cart
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you're passing the userId as a route parameter

    // Find the cart for the given userId and populate product details
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "products.productId", // Populate productId from the Product model
        select: "name price discountPrice images", // Select specific fields
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

