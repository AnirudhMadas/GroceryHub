import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        🛒 <span>GroceryHub</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/inventory">Inventory</NavLink>
        </li>

        <li>
          <NavLink to="/billing">Billing</NavLink>
        </li>

        <li>
          <NavLink to="/reports">Reports</NavLink>
        </li>

        <li>
          <NavLink to="/alerts">Alerts</NavLink>
        </li>

        <li>
          <NavLink to="/feedback">Feedback</NavLink>
        </li>

        {/* ✅ LOGIN / SIGNUP BUTTON */}
        <li>
          <button
            className="login-btn"
            onClick={() => navigate("/auth")}
          >
            Login / Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
