import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleOnDelete,
  handleOnEdit,
}) {
  return (
    <div className="ProductsContainer">
      {/* (|| []) Safely handle cases where products might be undefined */}
      {(products || []).map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={
            productQuantity.find((p) => p.id === product.id)?.quantity ?? 0
            // Safely gets the product's quantity (0 if the product has no quantity entry).
            //Needed to avoid errors if productQuantity.find(...) returns undefined
          }
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
      ))}
    </div>
  );
}
