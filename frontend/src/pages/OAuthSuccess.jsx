import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) throw new Error("Missing OAuth token");

      // 🔐 Mark OAuth flow
      localStorage.setItem("oauth_in_progress", "true");

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

      // ✅ Clear flag & redirect once
      localStorage.removeItem("oauth_in_progress");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("OAuth error:", err);
      localStorage.clear();
      setError("Authentication failed. Redirecting to login...");
      setTimeout(() => navigate("/auth"), 2000);
    }
  }, [login, navigate]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Signing you in with Google...</p>
    </div>
  );
};

export default OAuthSuccess;
