import { useEffect, useState } from "react";
import "../styles/Billing.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const GST_RATE = 0.05;

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Fetch inventory */
  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  /* Helpers */
  const filteredProducts = products.filter(
    (p) =>
      (p.productName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const isExpired = (expiryDate) =>
    expiryDate && new Date(expiryDate) < new Date();

  /* Add to cart */
  const addToCart = (product) => {
    if (!product) return;

    const availableStock = product.quantity ?? product.stock ?? 0;
    if (availableStock <= 0) return;

    if (isExpired(product.expiryDate)) {
      alert("❌ This product is expired and cannot be sold");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);

      if (existing) {
        if (existing.quantity + qty > existing.stock) return prev;
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

  /* Keyboard navigation */
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

  /* Cart actions */
  const updateCartQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id &&
        newQty >= 1 &&
        newQty <= item.stock
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  /* Totals */
  const subtotal = cart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );
  const gstAmount = subtotal * GST_RATE;
  const grandTotal = subtotal + gstAmount;

  /* Invoice */
  const generateInvoice = async () => {
    await axios.post(
      "http://localhost:5000/api/billing",
      cart.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
      }))
    );
    generatePDFInvoice();
    setCart([]);
  };

  const generatePDFInvoice = () => {
    const doc = new jsPDF();
    const invoiceNumber = `INV-${Date.now()}`;
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("GroceryHub Invoice", 14, 20);
    doc.setFontSize(11);
    doc.text(`Invoice No: ${invoiceNumber}`, 14, 30);
    doc.text(`Date: ${date}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [["Product", "Price", "Qty", "Total"]],
      body: cart.map((i) => [
        i.productName,
        `₹${i.price}`,
        i.quantity,
        `₹${(i.price * i.quantity).toFixed(2)}`,
      ]),
    });

    doc.text(`Total: ₹${grandTotal.toFixed(2)}`, 140, 80);
    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="billing-page">
      <div className="billing-card">
        <h2>Billing System</h2>

        {/* INPUT */}
        <div className="billing-form">
          <input
            placeholder="Search product..."
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

          {/* SUGGESTIONS */}
          {search && filteredProducts.length > 0 && (
            <div className="suggestions">
              {filteredProducts.map((p, index) => (
                <div
                  key={p._id}
                  className={`suggestion-item
                    ${index === activeIndex ? "active" : ""}
                    ${(p.quantity ?? 0) === 0 ? "out" : ""}
                    ${isExpired(p.expiryDate) ? "expired" : ""}
                  `}
                  onClick={() =>
                    !isExpired(p.expiryDate) && addToCart(p)
                  }
                >
                  <span>{p.productName}</span>
                  <span className="price">₹{p.price}</span>

                  {(p.quantity ?? 0) === 0 && (
                    <span className="stock-badge">Out</span>
                  )}

                  {isExpired(p.expiryDate) && (
                    <span className="expiry-label">Expired</span>
                  )}
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
              <div className="cart-info">
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

        {/* FOOTER */}
        <div className="billing-footer">
          <div className="bill-breakdown">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>GST (5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="grand-total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button disabled={!cart.length} onClick={generateInvoice}>
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
