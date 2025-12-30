import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import "../styles/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ CORRECT destructuring
  const { user, login, authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect logged-in users away from /auth
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await axiosInstance.post(endpoint, { email, password });

      // ✅ HARD VALIDATION (CRITICAL)
      if (!res.data?.user || !res.data?.token) {
        throw new Error(res.data?.message || "Invalid authentication response");
      }

      // ✅ Save auth ONLY if valid
      login(res.data.user, res.data.token);

      // ✅ Redirect after successful login
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed"
      );
    }
  };

  const googleLogin = () => {
    const baseURL =
      import.meta.env.VITE_API_URL ||
      axiosInstance.defaults.baseURL ||
      "https://groceryhub-7q1l.onrender.com";

    window.location.href = `${baseURL}/api/auth/google`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <h2>{isLogin ? "Welcome Back" : "Join GroceryHub"}</h2>

          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>

          <button onClick={googleLogin}>Sign in with Google</button>
        </div>

        <div className="auth-right">
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

            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
