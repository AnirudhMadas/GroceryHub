import "../styles/ProductCard.css";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const {
    productName,
    quantity,
    price,
    category,
    productImage,
    expiryDate,
  } = product;

  /* ---------- STOCK STATUS ---------- */
  let stockStatus = "In Stock";
  let stockClass = "green";

  if (quantity === 0) {
    stockStatus = "Out of Stock";
    stockClass = "red";
  } else if (quantity <= 10) {
    stockStatus = "Low Stock";
    stockClass = "orange";
  }

  /* ---------- EXPIRY STATUS ---------- */
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return "safe";

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "expired";
    if (diffDays <= 7) return "near";
    return "safe";
  };

  const expiryStatus = getExpiryStatus(expiryDate);

  return (
    <div className="product-card">
      {/* BADGES */}
      <div className="badge-row">
        <span className="category-badge">{category}</span>

        <span className={`stock-badge ${stockClass}`}>
          {stockStatus}
        </span>

        <span className={`expiry-badge ${expiryStatus}`}>
          {expiryStatus === "expired"
            ? "Expired"
            : expiryStatus === "near"
            ? "Near Expiry"
            : "Safe"}
        </span>
      </div>

      {/* IMAGE */}
      <img
        src={productImage || "/default-product.png"}
        alt={productName}
      />

      {/* DETAILS */}
      <h3>{productName}</h3>
      <p>Quantity: {quantity}</p>
      <p>Rs. {price}</p>

      {/* ACTIONS */}
      <div className="actions">
        <button className="edit-btn" onClick={onEdit}>
          Edit
        </button>

        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
