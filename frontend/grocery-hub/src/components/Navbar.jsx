import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        🛒 <span>GroceryHub</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>

        {user && (
          <>
            <li><NavLink to="/inventory">Inventory</NavLink></li>
            <li><NavLink to="/billing">Billing</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/alerts">Alerts</NavLink></li>
          </>
        )}

        {/* 🌙 THEME TOGGLE */}
        <li>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </li>

        {user ? (
          <li>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <button
              className="login-btn"
              onClick={() => navigate("/auth")}
            >
              Login / Sign Up
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
