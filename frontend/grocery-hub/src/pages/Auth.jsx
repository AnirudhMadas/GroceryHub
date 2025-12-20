import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

      const res = await axios.post(url, {
        email,
        password,
      });

      // Save user in context
      login({ email: res.data.email });

      // Redirect after auth
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <h2>{isLogin ? "Welcome Back" : "Join GroceryHub"}</h2>
          <p>
            {isLogin
              ? "Login securely to manage your grocery store"
              : "Create an account and start managing your store"}
          </p>

          <div className="auth-actions">
            <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>

          <button type="button" className="google-btn" onClick={googleLogin}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <h3>{isLogin ? "Login" : "Sign Up"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" className="auth-submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
