// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   brand: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   rating: {
//     type: Number,
//     max: [5, "wrong max rating"],
//   },
//   numReviews: {
//     type: Number,
//     required: true,
//     min: [0, "wrong min reviews"],
//   },
//   description: {
//     type: String,

//   },
//   price: {
//     type: Number,
//     required: true,
//     min: [0, "Price must be greater than or equal to 0"],
//   },
//   discountPercentage: {
//     type: Number,
//     required: true,
//     default: 0, // Default discount is 0%
//     min: [0, "Discount must be positive"],
//     max: [100, "Discount cannot exceed 100%"],
//   },
//   discountPrice: {
//     type: Number,
//   },
//   color: {
//     type: String,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   deleted: {
//     type: Boolean,
//     default: false,
//   },
//   stock: {
//     type: Number,
//     required: true,
//     min: [0, "Stock must be greater than or equal to 0"],
//   },
//   images: [
//     {
//       url: { type: String, required: true },
//       alt: { type: String },
//       order: { type: Number },
//     },
//   ],
//   specifications: {
//     type: Map,
//     of: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   seller: {
//     type: String,
//   },
// });




const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
    trim: true,
  },
  ImagesArray: {
    type: Object,
  },
  item_discountedPrize: {
    type: Number,
    min: [0, "Price must be greater than or equal to 0"],
  },
  item_hasFreeDelivery: {
    type: Boolean,
    default: false,
  },
  item_hasReturnDelivery: {
    type: Boolean,
    default: false,
  },
  item_hasVariations: {
    type: Boolean,
    default: false,
  },
  item_prize: {
    type: Number,
    required: true,
    min: [0, "Price must be greater than or equal to 0"],
  },
  item_rating: {
    type: Number,
    required: true,
    max: [5, "Rating cannot exceed 5"],
  },
  item_categoryTag: {
    type: String,
    required: true,
  },
  item_discountPercentile: {
    type: Number,
    min: [0, "Discount must be positive"],
    max: [100, "Discount cannot exceed 100%"],
  },
  item_comments: {
    type: Object,
  },
  item_mainCategory: {
    type: String,
  },
  item_buyAmount: {
    type: Number,
    min: [0, "Buy amount must be greater than or equal to 0"],
    default: 0,
  },
  item_description: {
    type: String,
    trim: true,
  },
  item_hasColor: {
    type: Boolean,
    default: false,
  },
  item_isStocked: {
    type: Boolean,
    default: false,
  },
});




// ** Pre-save hook to calculate discountPrice **
// productSchema.pre("save", function (next) {
//   if (this.isModified("price") || this.isModified("discountPercentage")) {
//     this.discountPrice =
//       this.price - (this.price * this.discountPercentage) / 100;
//   }
//   next();
// });


// ** Pre-save hook to calculate item_discountedPrize **
productSchema.pre("save", function (next) {
  if (
    this.isModified("item_prize") ||
    this.isModified("item_discountPercentile")
  ) {
    this.item_discountedPrize =
      this.item_prize -
      (this.item_prize * this.item_discountPercentile) / 100;
  }
  next();
});


module.exports = mongoose.model("Product", productSchema);
