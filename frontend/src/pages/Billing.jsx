import { useEffect, useState } from "react";
import "../styles/Billing.css";
import authAxios from "../utils/authAxios";

const GST_RATE = 0.05;

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---------- FETCH INVENTORY ---------- */
  useEffect(() => {
    authAxios
      .get("/api/inventory")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ---------- FILTER PRODUCTS ---------- */
  const filteredProducts = products.filter((p) =>
    (p.productName || "").toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (expiryDate) =>
    expiryDate && new Date(expiryDate) < new Date();

  /* ---------- ADD TO CART ---------- */
  const addToCart = (product) => {
    if (!product) return;

    const availableStock = product.quantity ?? 0;
    if (availableStock <= 0) return;

    if (isExpired(product.expiryDate)) {
      alert("❌ This product is expired");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);

      if (existing) {
        if (existing.quantity + qty > availableStock) return prev;
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [
        ...prev,
        { ...product, quantity: qty, stock: availableStock },
      ];
    });

    setSearch("");
    setQty(1);
    setActiveIndex(0);
  };

  /* ---------- KEYBOARD NAVIGATION ---------- */
  const handleKeyDown = (e) => {
    if (!search || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        i < filteredProducts.length - 1 ? i + 1 : i
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      addToCart(filteredProducts[activeIndex]);
    }
  };

  /* ---------- CART ACTIONS ---------- */
  const updateCartQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && newQty >= 1 && newQty <= item.stock
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  /* ---------- TOTALS ---------- */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gstAmount = subtotal * GST_RATE;
  const grandTotal = subtotal + gstAmount;

  /* ---------- GENERATE INVOICE ---------- */
  const generateInvoice = async () => {
    try {
      await authAxios.post(
        "/api/billing",
        cart.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: i.price,
          total: i.price * i.quantity,
        }))
      );

      setCart([]);
    } catch (err) {
      console.error("BILLING ERROR:", err.response?.data || err.message);
      alert("Billing failed");
    }
  };


  return (
    <div className="billing-page">
      <div className="billing-card">
        <h2>Billing System</h2>

        {/* INPUTS */}
        <div className="billing-form">
          <input
            placeholder="Search for a product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          {search && filteredProducts.length > 0 && (
            <div className="suggestions">
              {filteredProducts.map((p, index) => (
                <div
                  key={p._id}
                  className={`suggestion-item ${
                    index === activeIndex ? "active" : ""
                  }`}
                  onClick={() => addToCart(p)}
                >
                  <span>{p.productName}</span>
                  <span className="price">₹{p.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART */}
        <div className="cart">
          {cart.length === 0 && <p>No items in cart.</p>}

          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <div>
                <h4>{item.productName}</h4>
                <p>₹{item.price} each</p>
              </div>

              <div className="qty-controls">
                <button
                  onClick={() =>
                    updateCartQty(item._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateCartQty(item._id, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
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

        {/* BILL SUMMARY */}
        <div className="bill-summary-card">
          <div className="bill-summary-left">
            <p>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>

            <p>
              <span>GST (5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </p>

            <hr />

            <p className="grand-total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </p>
          </div>

          <div className="bill-summary-right">
            <button
              className="generate-btn"
              disabled={!cart.length}
              onClick={generateInvoice}
            >
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
