import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
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
      // ✅ Use axiosInstance instead of hardcoded URL
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await axiosInstance.post(endpoint, { email, password });

      localStorage.setItem("token", res.data.token);
      login(res.data.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const googleLogin = () => {
    // ✅ Get base URL from axiosInstance
    const baseURL = axiosInstance.defaults.baseURL || 
                    import.meta.env.VITE_API_URL || 
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

          <button onClick={googleLogin}>
            Sign in with Google
          </button>
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