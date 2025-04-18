const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    shopId: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "Product",
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
