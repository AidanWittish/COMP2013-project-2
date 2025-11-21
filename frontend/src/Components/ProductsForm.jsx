export default function ProductsForm({
  id,
  productName,
  brand,
  image,
  price,
  handleOnSubmit,
  handleOnChange,
  isEditing,
}) {
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        {/* Product Name */}
        <input
          type="text"
          name="productName"
          id="productName"
          onChange={handleOnChange}
          value={productName}
          placeholder="Product Name"
          required
        />
        <br />
        {/* Brand */}
        <input
          type="text"
          name="brand"
          id="brand"
          onChange={handleOnChange}
          value={brand}
          placeholder="Brand"
          required
        />
        <br />
        {/* Image URL */}
        <input
          type="text"
          name="image"
          id="image"
          onChange={handleOnChange}
          value={image}
          placeholder="Image URL"
        />
        <br />
        {/* Price */}
        <input
          type="text"
          name="price"
          id="price"
          onChange={handleOnChange}
          value={price}
          placeholder="Price"
          required
        />
        <br />
        <button>{isEditing ? "Editing" : "Submit"}</button>
      </form>
    </div>
  );
}
