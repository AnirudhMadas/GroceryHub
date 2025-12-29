import React from "react";
import { useLoaderData } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  // ✅ Loader data can be ANYTHING → make it safe
  const loaderData = useLoaderData();

  // ✅ Always work with an array
  const products = Array.isArray(loaderData) ? loaderData : [];

  // ✅ Safe derived values (NO crashes)
  const totalProducts = products.length;
  const totalQuantity = products.reduce(
    (sum, p) => sum + Number(p?.quantity || 0),
    0
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Manage Your Grocery Store with GroceryHub</h1>

        <h3>
          Streamline your operations with our all-in-one inventory management
          solution.
        </h3>

        <p>
          GroceryHub empowers grocery store owners to efficiently manage stock,
          process transactions, and gain insights through powerful reporting
          tools, all in a user-friendly platform.
        </p>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        <div className="stat-card">
          <h4>Total Products</h4>
          <p>{totalProducts}</p>
        </div>

        <div className="stat-card">
          <h4>Total Quantity</h4>
          <p>{totalQuantity}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">📦</div>
            <h4>Inventory Management</h4>
            <p>Track and update stock levels in real-time with ease.</p>
          </div>

          <div className="feature-card">
            <div className="icon">💲</div>
            <h4>Billing</h4>
            <p>Process transactions quickly and view billing history.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📊</div>
            <h4>Reports</h4>
            <p>Generate detailed sales and inventory reports for insights.</p>
          </div>

          <div className="feature-card">
            <div className="icon">⚠️</div>
            <h4>Alerts</h4>
            <p>Stay informed with notifications for low stock and updates.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
