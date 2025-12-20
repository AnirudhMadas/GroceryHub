import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Alerts.css";

const LOW_STOCK_LIMIT = 10;

const Alerts = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("out");

  /* FETCH INVENTORY */
  useEffect(() => {
    const fetchInventory = async () => {
      const res = await axios.get("http://localhost:5000/api/inventory");
      setProducts(res.data);
    };
    fetchInventory();
  }, []);

  /* FILTERS */
  const outOfStock = products.filter((p) => p.quantity === 0);
  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT
  );

  const displayed = activeTab === "out" ? outOfStock : lowStock;

  /* REORDER HANDLER */
  const handleReorder = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/alerts/reorder/${id}`
      );

      const { productName, category } = res.data;

      const query = encodeURIComponent(
        `${productName} ${category || ""} grocery`
      );

      window.open(`https://www.amazon.in/s?k=${query}`, "_blank");
    } catch (err) {
      console.error("REORDER ERROR:", err.response?.data || err.message);
      alert("Reorder failed. Check console.");
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-card">
        <h1>Inventory Alerts</h1>
        <p className="subtitle">
          Monitor your inventory levels and reorder products from Amazon when
          necessary.
        </p>

        {/* TABS */}
        <div className="tabs">
          <button
            className={activeTab === "out" ? "active" : ""}
            onClick={() => setActiveTab("out")}
          >
            Out of Stock ({outOfStock.length})
          </button>

          <button
            className={activeTab === "low" ? "active" : ""}
            onClick={() => setActiveTab("low")}
          >
            Low Stock ({lowStock.length})
          </button>
        </div>

        {/* ALERT LIST */}
        {displayed.length === 0 && <p className="empty">No alerts 🎉</p>}

        {displayed.map((item) => (
          <div className="alert-item" key={item._id}>
            <h3>{item.productName}</h3>
            <p>Category: {item.category || "N/A"}</p>

            <span className={`badge ${item.quantity === 0 ? "out" : "low"}`}>
              {item.quantity}{" "}
              {item.quantity === 0 ? "(Out of Stock)" : "(Low Stock)"}
            </span>

            <p>Price: Rs.{item.price}</p>

            <button onClick={() => handleReorder(item._id)}>Reorder</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
