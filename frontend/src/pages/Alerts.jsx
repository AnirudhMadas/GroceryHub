import { useEffect, useState } from "react";
import "../styles/Alerts.css";
import axiosInstance from "../utils/axiosInstance";

const LOW_STOCK_LIMIT = 10;

const Alerts = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("out");

  useEffect(() => {
    axiosInstance.get("/api/inventory").then((res) => setProducts(res.data));
  }, []);

  const outOfStock = products.filter((p) => p.quantity === 0);
  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT
  );

  const displayed = activeTab === "out" ? outOfStock : lowStock;

  const handleReorder = async (id) => {
    try {
      const res = await axiosInstance.post(`/api/alerts/reorder/${id}`);
      const { productName, category } = res.data;

      const query = encodeURIComponent(`${productName} ${category || ""}`);
      window.open(`https://www.amazon.in/s?k=${query}`, "_blank");
    } catch (err) {
      alert("Reorder failed");
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-card">
        <h2>Inventory Alerts</h2>

        <div className="tabs">
          <button onClick={() => setActiveTab("out")}>
            Out of Stock ({outOfStock.length})
          </button>
          <button onClick={() => setActiveTab("low")}>
            Low Stock ({lowStock.length})
          </button>
        </div>

        {displayed.length === 0 && <p>No alerts 🎉</p>}

        {displayed.map((item) => (
          <div className="alert-item" key={item._id}>
            <h4>{item.productName}</h4>
            <p>Qty: {item.quantity}</p>
            <button onClick={() => handleReorder(item._id)}>Reorder</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
