const Products = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div className="products-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <h4>{product.productName}</h4>
          <p>Price: ₹{product.price}</p>
          <p>Qty: {product.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
