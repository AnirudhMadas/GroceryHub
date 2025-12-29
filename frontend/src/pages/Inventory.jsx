import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Inventory.css";
import axiosInstance from "../utils/axiosInstance";

const Inventory = () => {
  /* ---------- LOADER → STATE SYNC ---------- */
  const loaderProducts = useLoaderData();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(Array.isArray(loaderProducts) ? loaderProducts : []);
  }, [loaderProducts]);

  const LOW_STOCK_LIMIT = 10;

  /* ---------- FILTERS ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  /* ---------- FORM ---------- */
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    category: "",
    productImage: "",
    expiryDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  /* ---------- SUMMARY ---------- */
  const totalProducts = products.length;
  const totalQuantity = products.reduce(
    (s, p) => s + Number(p?.quantity || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => p?.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT
  ).length;
  const totalValue = products.reduce(
    (s, p) => s + (p?.quantity || 0) * (p?.price || 0),
    0
  );

  const categories = [
    "All",
    ...new Set(products.map((p) => p?.category).filter(Boolean)),
  ];

  /* ---------- FILTER LOGIC ---------- */
  const filteredProducts = products
    .filter((item) => item && item.productName)
    .filter((item) => {
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

  /* ---------- FORM HANDLERS ---------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      productName: "",
      quantity: "",
      price: "",
      category: "",
      productImage: "",
      expiryDate: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  /* ---------- ADD / UPDATE ---------- */
  const handleSubmit = async () => {
    try {
      if (!formData.productName || !formData.price) {
        alert("Product name and price are required");
        return;
      }

      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };

      let res;

      if (isEditing && editId) {
        // 🔐 EDIT INVENTORY (JWT INCLUDED)
        res = await axiosInstance.put(`/api/inventory/${editId}`, payload);

        setProducts((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
      } else {
        // 🔐 ADD INVENTORY (JWT INCLUDED)
        res = await axiosInstance.post("/api/inventory", payload);

        setProducts((prev) => [...prev, res.data]);
      }

      resetForm();
    } catch (err) {
      console.error("SUBMIT FAILED:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Operation failed");
      }
    }
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);

    setFormData({
      productName: product.productName || "",
      quantity: product.quantity || "",
      price: product.price || "",
      category: product.category || "",
      productImage: product.productImage || "",
      expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
    });
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axiosInstance.delete(`/api/inventory/${id}`);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("DELETE FAILED:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Delete failed");
      }
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="inventory-page">
      <div className="inventory-layout">
        {/* SIDEBAR */}
        <aside className="inventory-sidebar">
          <div className="sidebar-card compact">
            <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

            <input
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />

            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />

            <input
              name="productImage"
              placeholder="Image URL (optional)"
              value={formData.productImage}
              onChange={handleChange}
            />

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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <label>Stock Level</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option>All</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

            <label>Search</label>
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </aside>

        {/* MAIN */}
        <main className="inventory-content">
          {/* SUMMARY */}
          <div className="inventory-summary">
            <div className="summary-box">
              <p>Products</p>
              <h3>{totalProducts}</h3>
            </div>

            <div className="summary-box">
              <p>Quantity</p>
              <h3>{totalQuantity}</h3>
            </div>

            <div className="summary-box warning">
              <p>Low Stock</p>
              <h3>{lowStockCount}</h3>
            </div>

            <div className="summary-box success">
              <p>Value</p>
              <h3>₹{totalValue}</h3>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="product-grid">
            {filteredProducts.map((item) => (
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
