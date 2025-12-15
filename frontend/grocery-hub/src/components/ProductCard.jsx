import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const {
    productName,
    quantity,
    price,
    category,
    productImage,
  } = product;

  let stockStatus = "In Stock";
  let stockClass = "green";

  if (quantity === 0) {
    stockStatus = "Out of Stock";
    stockClass = "red";
  } else if (quantity <= 10) {
    stockStatus = "Low Stock";
    stockClass = "orange";
  }

  return (
    <div className="product-card">
      {/* Category */}
      <span className="category-badge">{category}</span>

      {/* Stock status */}
      <span className={`stock-badge ${stockClass}`}>
        {stockStatus}
      </span>

      {/* Image */}
      <img
        src={productImage || "/default-product.png"}
        alt={productName}
      />

      {/* Details */}
      <h3>{productName}</h3>
      <p>Quantity: {quantity}</p>
      <p>Rs.{price}</p>

      {/* Actions */}
      <div className="actions">
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;
