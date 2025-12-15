import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        🛒 <span>GroceryHub</span>
      </div>

      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>

        {user && (
          <>
            <li><NavLink to="/inventory">Inventory</NavLink></li>
            <li><NavLink to="/billing">Billing</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/alerts">Alerts</NavLink></li>
          </>
        )}

        <li><NavLink to="/feedback">Feedback</NavLink></li>

        {/* AUTH SECTION */}
        {user ? (
          <>
            <li className="user-email">{user.email}</li>
            <li>
              <button className="login-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
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
