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

  // 📊 Summary Calculations
  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0
  );

  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT
  ).length;

  const totalValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  // 📂 Categories
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // 🔥 Filtering Logic
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
      <div className="inventory-layout">

        {/* ⬅️ SIDEBAR */}
        <aside className="inventory-sidebar">
          <div className="sidebar-card">
            <h3>Filters</h3>

            <label>Category</label>
            <select
              className={selectedCategory !== "All" ? "active-filter" : ""}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label>Stock Level</label>
            <select
              className={stockFilter !== "All" ? "active-filter" : ""}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              className={searchTerm ? "active-filter" : ""}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </aside>

        {/* ➡️ MAIN CONTENT */}
        <main className="inventory-content">

          {/* 📊 SUMMARY */}
          <div className="inventory-summary">
            <div className="summary-box">
              <span className="summary-icon">📦</span>
              <div>
                <p className="summary-label">Products</p>
                <h3>{totalProducts}</h3>
              </div>
            </div>

            <div className="summary-box">
              <span className="summary-icon">🧮</span>
              <div>
                <p className="summary-label">Quantity</p>
                <h3>{totalQuantity}</h3>
              </div>
            </div>

            <div className="summary-box warning">
              <span className="summary-icon">⚠️</span>
              <div>
                <p className="summary-label">Low Stock</p>
                <h3>{lowStockCount}</h3>
              </div>
            </div>

            <div className="summary-box success">
              <span className="summary-icon">💰</span>
              <div>
                <p className="summary-label">Value</p>
                <h3>₹{totalValue}</h3>
              </div>
            </div>
          </div>

          {/* 🧱 PRODUCTS */}
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Inventory;
