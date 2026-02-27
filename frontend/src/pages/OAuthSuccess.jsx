import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple executions (STRICT MODE / HYDRATION)
    if (hasRun.current) return;
    hasRun.current = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) throw new Error("Missing OAuth token");

      const decoded = jwtDecode(token);

      if (!decoded?._id || !decoded?.email) {
        throw new Error("Invalid token payload");
      }

      login(
        {
          _id: decoded._id,
          email: decoded.email,
          provider: decoded.provider || "google",
        },
        token
      );

      navigate("/", { replace: true });
    } catch (err) {
      console.error("OAuth error:", err);
      localStorage.clear();
      setError("Authentication failed. Redirecting to login...");
      setTimeout(() => navigate("/auth"), 1500);
    }
  }, [login, navigate]);

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return <p style={{ textAlign: "center" }}>Signing you in with Google…</p>;
};

export default OAuthSuccess;
