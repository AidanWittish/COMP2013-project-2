import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
import ProductsForm from "./ProductsForm";

export default function GroceriesAppContainer({}) {
  //States

  //used to store the products fetched from the database
  const [productsData, setProductsData] = useState([]);

  //used to store the quantity of each product in the productsData state
  const [productQuantity, setProductQuantity] = useState([]);

  //used to store the products added to the cart
  const [cartList, setCartList] = useState([]);

  //used to store the data from the form
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",
  });

  //used to show response messages from the POST/DELETE/PATCH requests
  //of the form
  const [postResponse, setPostResponse] = useState("");

  //used to make sure when we are editing a product,
  // we don't make a new one, only edit the current one
  const [isEditing, setIsEditing] = useState(false);

  //useEffects

  //Fetch products when the component first appears(mounts)
  //and again whenever postResponse changes (i.e after a POST/DELETE/PATCH)
  useEffect(() => {
    handleProductsDB();
  }, [postResponse]);

  //Handlers

  //GET Data from DB handler
  //This grabs all of the data from our database to be used in the productsContainer
  //and productQuantity states, this acts like a parallel array to productsData.
  const handleProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      //products will be an empty array if response.data is undefined or null
      const products = response.data || [];
      // Normalize id so UI can rely on id (backend may return _id)
      const normalized = products.map((p) => ({ ...p, id: p.id ?? p._id }));
      setProductsData(normalized);

      // initialize productQuantity entries for each product
      //This is so that when we fetch new products, we also set up their quantities to 0
      //in the productQuantity state
      setProductQuantity(
        normalized.map((product) => ({ id: product.id, quantity: 0 }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //handles reseting the data in the form
  //This means that when we submit the data to the form, the previous data is cleared
  const handleResetForm = () => {
    setFormData({
      id: "",
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };

  //Handle the submission of data
  //When we submit the data, it is either posted as a new product or updated if we are editing
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        handleOnUpdate(formData._id);
        handleResetForm();
        setIsEditing(false);
      } else {
        await axios
          .post("http://localhost:3000/products", formData)
          .then((response) => setPostResponse(response.data.message))
          .then(() => handleResetForm());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle the onChange event for the form
  //Updates the formData state as the user types
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.id]: e.target.value };
    });
  };

  //Handle to delete one product by id
  //Makes a delete request to the backend server to get rid of one of
  //the products in the database
  const handleOnDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/products/${id}`
      );
      setPostResponse(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle the edition of one product by its id
  //Makes a GET request to the backend to get the data of one product
  //and fills the form with that data for editing
  const handleOnEdit = async (id) => {
    try {
      const productToEdit = await axios.get(
        `http://localhost:3000/products/${id}`
      );
      setFormData({
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
        _id: productToEdit.data._id,
      });
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  };

  //Handle updating the API patch route
  //When we are editing a product, this function makes a PATCH request
  //to update the product in the database
  const handleOnUpdate = async (id) => {
    try {
      const result = await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );
      setPostResponse(result.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  //Handles adding a quantity for a product in either the container or cart
  //depending on which "mode" we are in
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((pQ) => {
        if (pQ.id === productId) {
          return { ...pQ, quantity: pQ.quantity + 1 };
        }
        return pQ;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  //Handles removing a quantity from the product in the container or cart
  //depending on which "mode" we are in
  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((item) => {
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((pQ) => {
        if (pQ.id === productId && pQ.quantity > 0) {
          return { ...pQ, quantity: pQ.quantity - 1 };
        }
        return pQ;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  //Handles adding a product from the container to the cart
  //It checks if the product is already in the cart before adding
  //If it is, it increases the quantity instead of adding a duplicate entry
  const handleAddToCart = (productId) => {
    const product = productsData.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  //Handles removing a product from the cart.
  //This removes the product entirely from the cartList state, but
  //does not affect the productQuantity state in the ProductsContainer
  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  //Handles getting rid of every item in the cart
  //Empties the cartList state
  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <ProductsForm
        id={formData.id}
        productName={formData.productName}
        brand={formData.brand}
        image={formData.image}
        price={formData.price}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        isEditing={isEditing}
      />
      <p>{postResponse}</p>
      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={productsData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
