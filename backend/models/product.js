//Initializing the model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the product model schema
const productSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

//package and export the model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
