import { useEffect, useState } from "react";
import "../styles/Billing.css";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  /* Add item */
  const addToCart = (product) => {
    if (!product || product.quantity <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);

      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + Number(qty) }
            : item
        );
      }

      return [...prev, { ...product, quantity: Number(qty) }];
    });

    setSearch("");
    setQty(1);
  };

  /* Enter key adds first result */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      addToCart(filteredProducts[0]);
    }
  };

  /* Remove item */
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const generateInvoice = async () => {
    await fetch("http://localhost:5000/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(item => ({
          productId: item._id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
      }),
    });

    alert("Invoice generated successfully!");
    setCart([]);
  };

  return (
    <div className="billing-page">
      <div className="billing-card">
        <h2>Billing System</h2>

        <div className="billing-form">
          <input
            placeholder="Search for a product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          {search && filteredProducts.length > 0 && (
            <div className="suggestions">
              {filteredProducts.map(p => (
                <div
                  key={p._id}
                  className={`suggestion-item ${
                    p.quantity === 0 ? "out" : ""
                  }`}
                  onClick={() => addToCart(p)}
                >
                  <span>{p.productName}</span>
                  <span className="price">₹{p.price}</span>

                  {p.quantity === 0 && (
                    <span className="stock-badge">Out</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart">
          {cart.length === 0 && <p>No items in cart.</p>}

          {cart.map(item => (
            <div className="cart-item" key={item._id}>
              <div>
                <strong>{item.productName}</strong>
                <div className="cart-sub">
                  {item.quantity} × ₹{item.price}
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="billing-footer">
          <h3>Total: ₹{total.toFixed(2)}</h3>
          <button disabled={!cart.length} onClick={generateInvoice}>
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
