import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Inventory.css";

const Inventory = () => {
  const products = useLoaderData();

  const LOW_STOCK_LIMIT = 10;

  // 🔎 Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // 📊 Summary
  const totalProducts = products.length;
  const totalQuantity = products.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const lowStockCount = products.filter(
    (item) => item.quantity > 0 && item.quantity <= LOW_STOCK_LIMIT
  ).length;
  const totalValue = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // 📂 Unique Categories
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // 🔥 Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && item.quantity > LOW_STOCK_LIMIT) ||
      (stockFilter === "Low Stock" &&
        item.quantity > 0 &&
        item.quantity <= LOW_STOCK_LIMIT) ||
      (stockFilter === "Out of Stock" && item.quantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="inventory-page">
      <h2>Products ({filteredProducts.length})</h2>

      {/* 📊 Summary Bar */}
      <div className="inventory-summary">
        <div className="summary-card">
          <h4>📦 Products</h4>
          <p>{totalProducts}</p>
        </div>
        <div className="summary-card">
          <h4>🧮 Total Quantity</h4>
          <p>{totalQuantity}</p>
        </div>
        <div className="summary-card warning">
          <h4>⚠️ Low Stock</h4>
          <p>{lowStockCount}</p>
        </div>
        <div className="summary-card success">
          <h4>💰 Inventory Value</h4>
          <p>₹{totalValue}</p>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* 🧱 Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
