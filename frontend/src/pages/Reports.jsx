import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/Reports.css";
import axiosInstance from "../utils/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sales, setSales] = useState([]);

  /* ---------- FETCH REPORTS ---------- */
  const fetchReports = async (params = {}) => {
    try {
      const res = await axiosInstance.get("/api/reports", { params });
      setSales(res.data);
    } catch (err) {
      console.error("REPORT FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const applyFilters = () => {
    fetchReports({
      search,
      from: fromDate,
      to: toDate,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    fetchReports();
  };

  /* ---------- METRICS ---------- */
  const totalRevenue = sales.reduce((s, i) => s + i.total, 0);
  const totalProductsSold = sales.reduce((s, i) => s + i.quantity, 0);
  const uniqueProducts = new Set(sales.map((s) => s.productName)).size;

  /* ---------- PRODUCT SALES MAP ---------- */
  const productSales = sales.reduce((acc, item) => {
    acc[item.productName] = acc[item.productName] || {
      quantity: 0,
      revenue: 0,
    };
    acc[item.productName].quantity += item.quantity;
    acc[item.productName].revenue += item.total;
    return acc;
  }, {});

  /* ---------- LEAST SOLD PRODUCTS ---------- */
  const leastSoldProducts = Object.entries(productSales)
    .sort((a, b) => a[1].quantity - b[1].quantity)
    .slice(0, 3); // bottom 3

  /* ---------- BAR CHART ---------- */
  const barData = {
    labels: ["Sales Overview"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [totalRevenue],
        backgroundColor: "#22c55e",
        borderRadius: 10,
      },
      {
        label: "Units Sold",
        data: [totalProductsSold],
        backgroundColor: "#f59e0b",
        borderRadius: 10,
      },
    ],
  };

  /* ---------- PIE CHART ---------- */
  const pieData = {
    labels: Object.keys(productSales),
    datasets: [
      {
        data: Object.values(productSales).map((p) => p.revenue),
        backgroundColor: [
          "#22c55e",
          "#16a34a",
          "#f59e0b",
          "#ef4444",
          "#6366f1",
          "#0ea5e9",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: { size: 13 },
        },
      },
    },
  };

  return (
    <div className="reports-page">
      <div className="reports-card">
        <h2>Sales Reports</h2>

        {/* FILTERS */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="date-filters">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <button className="primary-btn" onClick={applyFilters}>
              Apply
            </button>
            <button className="secondary-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No reports found
                </td>
              </tr>
            ) : (
              sales.map((item) => (
                <tr key={item._id}>
                  <td>
                    {new Date(item.billedAt).toLocaleDateString()}
                    <br />
                    <span className="time">
                      {new Date(item.billedAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* SUMMARY */}
        <div className="summary">
          <div className="summary-box">
            <span>Total Revenue</span>
            <h3>₹{totalRevenue}</h3>
          </div>
          <div className="summary-box">
            <span>Products Sold</span>
            <h3>{totalProductsSold}</h3>
          </div>
          <div className="summary-box">
            <span>Unique Products</span>
            <h3>{uniqueProducts}</h3>
          </div>
        </div>

        {/* LEAST SOLD */}
        <h3 className="section-title warning-title">
          Least Sold Products (Avoid Restocking)
        </h3>

        <div className="least-sold">
          {leastSoldProducts.length === 0 ? (
            <p className="no-data">Not enough data</p>
          ) : (
            leastSoldProducts.map(([name, data]) => (
              <div key={name} className="least-card">
                <h4>{name}</h4>
                <p>
                  Units Sold: <strong>{data.quantity}</strong>
                </p>
                <span className="warning-text">
                  ⚠ Low demand – avoid overstocking
                </span>
              </div>
            ))
          )}
        </div>

        {/* CHARTS */}
        <h3 className="section-title">Sales Overview</h3>

        <div className="charts">
          <div className="chart-box">
            <h4>Revenue vs Units Sold</h4>
            <Bar data={barData} options={chartOptions} />
          </div>

          <div className="chart-box">
            <h4>Revenue by Product</h4>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
