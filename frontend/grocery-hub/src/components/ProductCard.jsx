import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const {
    productName,
    quantity,
    price,
    category,
    productImage,
  } = product;

  const stockStatus =
    quantity > 20 ? "In Stock" : "Low Stock";

  return (
    <div className={`product-card ${stockStatus === "In Stock" ? "in-stock" : "low-stock"}`}>
      
      {/* Category */}
      <span className="category-badge">{category}</span>

      {/* Stock status */}
      <span className={`stock-badge ${stockStatus === "In Stock" ? "green" : "orange"}`}>
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
