const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    max: [5, "wrong max rating"],
  },
  numReviews: {
    type: Number,
    min: [0, "wrong min reviews"],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be greater than or equal to 0"],
  },
  discountPercentage: {
    type: Number,
    required: true,
    default: 0, // Default discount is 0%
    min: [0, "Discount must be positive"],
    max: [100, "Discount cannot exceed 100%"],
  },
  discountPrice: {
    type: Number,
  },
  color: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock must be greater than or equal to 0"],
  },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
      order: { type: Number },
    },
  ],
  specifications: {
    type: Map,
    of: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  seller: {
    type: String,
  },
});

// ** Pre-save hook to calculate discountPrice **
productSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discountPercentage")) {
    this.discountPrice =
      this.price - (this.price * this.discountPercentage) / 100;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
