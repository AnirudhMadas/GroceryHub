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
import axios from "axios";

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

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (params = {}) => {
    const res = await axios.get("http://localhost:5000/api/reports", {
      params,
    });
    setSales(res.data);
  };

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

  const totalRevenue = sales.reduce((s, i) => s + i.total, 0);
  const totalProducts = sales.reduce((s, i) => s + i.quantity, 0);
  const uniqueProducts = new Set(sales.map((s) => s.productName)).size;

  /* ---------- LEAST SOLD PRODUCTS ---------- */
const productSalesCount = sales.reduce((acc, s) => {
  acc[s.productName] = (acc[s.productName] || 0) + s.quantity;
  return acc;
}, {});

const leastSoldProducts = Object.entries(productSalesCount)
  .sort((a, b) => a[1] - b[1]) // ascending = least sold first
  .slice(0, 3); // bottom 3


  /* ---------- BAR CHART ---------- */
  const barData = {
    labels: ["Current Period"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [totalRevenue],
        backgroundColor: "#2e7d32",
        borderRadius: 8,
      },
      {
        label: "Units Sold",
        data: [totalProducts],
        backgroundColor: "#ff9800",
        borderRadius: 8,
      },
    ],
  };

  /* ---------- PIE CHART ---------- */
  const productRevenue = sales.reduce((acc, s) => {
    acc[s.productName] = (acc[s.productName] || 0) + s.total;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(productRevenue),
    datasets: [
      {
        data: Object.values(productRevenue),
        backgroundColor: [
          "#1976d2",
          "#43a047",
          "#fb8c00",
          "#e53935",
          "#8e24aa",
          "#00897b",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#333" },
      },
      y: {
        ticks: { color: "#333" },
      },
    },
  };

  return (
    <div className="reports-page">
      <div className="reports-card">
        <h2>Sales Reports</h2>

        {/* Filters */}
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

        {/* Table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price (₹)</th>
              <th>Total (₹)</th>
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

            {sales.length > 0 && (
              <tr className="total-row">
                <td>-</td>
                <td>
                  <strong>TOTAL SALES</strong>
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <strong>₹{totalRevenue}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary */}
        <div className="summary">
          <div className="summary-box">
            <span>Total Revenue</span>
            <h3>₹{totalRevenue}</h3>
          </div>
          <div className="summary-box">
            <span>Products Sold</span>
            <h3>{totalProducts}</h3>
          </div>
          <div className="summary-box">
            <span>Unique Products</span>
            <h3>{uniqueProducts}</h3>
          </div>
        </div>

        {/* Least Sold Products Insight */}
<h3 className="section-title warning-title">
  Least Sold Products (Avoid Restocking)
</h3>

<div className="least-sold">
  {leastSoldProducts.length === 0 ? (
    <p className="no-data">Not enough data to analyze</p>
  ) : (
    leastSoldProducts.map(([product, qty]) => (
      <div key={product} className="least-card">
        <h4>{product}</h4>
        <p>
          Units Sold: <strong>{qty}</strong>
        </p>
        <span className="warning-text">
          ⚠ Low demand – consider reducing stock or offering discounts
        </span>
      </div>
    ))
  )}
</div>


        {/* Charts */}
        <h3 className="section-title">Sales Overview</h3>

        <div className="charts">
          <div className="chart-box">
            <h4>Sales Summary</h4>
            <Bar data={barData} options={chartOptions} />
          </div>

          <div className="chart-box">
            <h4>Top Products by Revenue</h4>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
