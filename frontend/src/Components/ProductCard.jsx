import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  _id,
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  id,
  handleOnDelete,
  handleOnEdit,
}) {
  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      {image ? <img src={image} alt="" /> : null}
      {/* to make sure there are no errors with the image*/}
      <h4>{brand}</h4>
      {/* <div className="ProductQuantityDiv">
        <div onClick={() => handleRemoveQuantity(id)} className="QuantityBtn">
          <p>➖</p>
        </div>

        <p>{productQuantity}</p>
        <div onClick={() => handleAddQuantity(id)} className="QuantityBtn">
          <p>➕</p>
        </div>
      </div> */}
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />
      <h3>{price}</h3>
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      <button onClick={() => handleOnEdit(_id)}>Edit</button>
      <br />
      <button onClick={() => handleOnDelete(_id)}>Delete</button>
    </div>
  );
}
