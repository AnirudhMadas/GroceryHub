import { useEffect, useState } from "react";
import "../styles/Billing.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GST_RATE = 0.05; // 5% GST

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

  /* Filter products */
  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  /* Add to cart */
  const addToCart = (product) => {
    if (!product || product.quantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        if (existing.quantity + Number(qty) > existing.stock) {
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + Number(qty) }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: Number(qty),
          stock: product.quantity, // 👈 store stock separately
        },
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
      setActiveIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      addToCart(filteredProducts[activeIndex]);
    }
  };

  /* Remove item */
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  /* Total */
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateCartQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        if (newQty < 1) return item;
        if (newQty > item.stock) return item;

        return { ...item, quantity: newQty };
      })
    );
  };

  /* Generate invoice */
  const generateInvoice = async () => {
    await fetch("http://localhost:5000/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item._id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        subtotal,
        gst: gstAmount,
        grandTotal,
      }),
    });

    generatePDFInvoice(); // 👈 PDF
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gstAmount = subtotal * GST_RATE;
  const grandTotal = subtotal + gstAmount;

  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    const invoiceNumber = `INV-${Date.now()}`;
    const date = new Date().toLocaleString();

    // Header
    doc.setFontSize(18);
    doc.text("GroceryHub Invoice", 14, 20);

    doc.setFontSize(11);
    doc.text(`Invoice No: ${invoiceNumber}`, 14, 30);
    doc.text(`Date: ${date}`, 14, 36);

    // Table
    autoTable(doc, {
      startY: 45,
      head: [["Product", "Price", "Qty", "Total"]],
      body: cart.map((item) => [
        item.productName,
        `₹${item.price}`,
        item.quantity,
        `₹${(item.price * item.quantity).toFixed(2)}`,
      ]),
    });

    const finalY = doc.lastAutoTable.finalY || 60;

    // Totals
    doc.setFontSize(11);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 140, finalY + 10);
    doc.text(`GST (5%): ₹${gstAmount.toFixed(2)}`, 140, finalY + 18);

    doc.setFontSize(13);
    doc.text(`Total: ₹${grandTotal.toFixed(2)}`, 140, finalY + 28);

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="billing-page">
      <div className="billing-card">
        <h2>Billing System</h2>

        {/* INPUT SECTION */}
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
            onChange={(e) => setQty(e.target.value)}
          />

          {/* SUGGESTIONS */}
          {search.trim() !== "" && filteredProducts.length > 0 && (
            <div className="suggestions">
              {filteredProducts.map((p, index) => (
                <div
                  key={p._id}
                  className={`suggestion-item ${
                    index === activeIndex ? "active" : ""
                  } ${p.quantity === 0 ? "out" : ""}`}
                  onClick={() => addToCart(p)}
                >
                  <span>{p.productName}</span>
                  <span className="price">₹{p.price}</span>

                  {p.quantity === 0 && <span className="stock-badge">Out</span>}
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
              {/* Left: Product Info */}
              <div className="cart-info">
                <h4>{item.productName}</h4>
                <p>₹{item.price} each</p>
                {item.stock - item.quantity <= 3 && (
                  <p className="stock-warning">
                    Only {item.stock - item.quantity} left
                  </p>
                )}
              </div>

              {/* Middle: Quantity */}
              <div className="qty-controls">
                <button
                  className="qty-btn minus"
                  onClick={() => updateCartQty(item._id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  −
                </button>

                <span className="qty-value">{item.quantity}</span>

                <button
                  className="qty-btn plus"
                  onClick={() => updateCartQty(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              {/* Right: Item Total */}
              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
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

          <button
            disabled={
              !cart.length || cart.some((item) => item.quantity > item.stock)
            }
            onClick={generateInvoice}
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
