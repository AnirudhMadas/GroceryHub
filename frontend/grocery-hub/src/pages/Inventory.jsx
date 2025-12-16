import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/Inventory.css";

const Inventory = () => {
  const loaderProducts = useLoaderData();
  const [products, setProducts] = useState(loaderProducts);

  const LOW_STOCK_LIMIT = 10;

  // 🔎 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // ➕ Add / Edit Form
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    category: "",
    productImage: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 📊 Summary
  const totalProducts = products.length;
  const totalQuantity = products.reduce((s, p) => s + Number(p.quantity || 0), 0);
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT
  ).length;
  const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  // 🔥 Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && item.quantity > LOW_STOCK_LIMIT) ||
      (stockFilter === "Low Stock" && item.quantity > 0 && item.quantity <= LOW_STOCK_LIMIT) ||
      (stockFilter === "Out of Stock" && item.quantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // ================= CRUD =================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      productName: "",
      quantity: "",
      price: "",
      category: "",
      productImage: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const res = await axios.put(
          `http://localhost:5000/api/inventory/${editId}`,
          formData
        );
        setProducts(products.map(p => p._id === editId ? res.data : p));
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/inventory",
          formData
        );
        setProducts([...products, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/inventory/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="inventory-page">
      <div className="inventory-layout">

        {/* ⬅️ SIDEBAR */}
        <aside className="inventory-sidebar">

          {/* ADD PRODUCT */}
          <div className="sidebar-card compact">
            <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

            <input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} />
            <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
            <input name="productImage" placeholder="Image URL (optional)" value={formData.productImage} onChange={handleChange} />

            <button className="primary-btn" onClick={handleSubmit}>
              {isEditing ? "Update Product" : "Add Product"}
            </button>

            {isEditing && (
              <button className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div className="sidebar-card compact">
            <h3>Filters</h3>

            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>

            <label>Stock Level</label>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option>All</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </aside>

        {/* ➡️ MAIN */}
        <main className="inventory-content">

          {/* SUMMARY */}
          <div className="inventory-summary">
            <div className="summary-box"><span>📦</span><div><p>Products</p><h3>{totalProducts}</h3></div></div>
            <div className="summary-box"><span>🧮</span><div><p>Quantity</p><h3>{totalQuantity}</h3></div></div>
            <div className="summary-box warning"><span>⚠️</span><div><p>Low Stock</p><h3>{lowStockCount}</h3></div></div>
            <div className="summary-box success"><span>💰</span><div><p>Value</p><h3>₹{totalValue}</h3></div></div>
          </div>

          {/* PRODUCTS */}
          <div className="product-grid">
            {filteredProducts.map(item => (
              <ProductCard
                key={item._id}
                product={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Inventory;
