//Initializing server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose"); //To import mongoose
require("dotenv").config(); //To import dotenv
const { DB_URI } = process.env; //To grab the same variable from the dotenv file
const cors = require("cors"); //For disabling default browser security
const Product = require("./models/product"); //importing the model schema

//Middleware
server.use(express.json()); //To ensure data is transmitted as json
server.use(express.urlencoded({ extended: true })); //To ensure data is encoded and de-coded while transmission
server.use(cors()); //To enable cors

//Database connection and server listening
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Database is connected\nServer is listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

//Routes
//Root route
server.get("/", (request, response) => {
  response.send("Server is Live!");
});

//To GET all the data from products collection
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//To POST a new product to the database
server.post("/products", async (request, response) => {
  const { id, productName, brand, image, price } = request.body;
  const newProduct = new Product({
    id,
    productName,
    brand,
    image,
    price,
  });
  try {
    await newProduct.save();
    response.status(200).send({
      message: `Product has been added successfully! ${crypto.randomUUID()}`,
    });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//To DELETE a product from the database by its id
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Product.findByIdAndDelete(id);
    response.send({ message: `Product has been deleted with the id ${id}` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//To GET one product by id
server.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//To PATCH a product by id
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  try {
    await Product.findByIdAndUpdate(id, {
      productName,
      brand,
      image,
      price,
    });
    response.send({ message: `Product has been updated with the id ${id}` });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
