import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error("Missing OAuth token");
        }

        // ✅ Save token first
        localStorage.setItem("token", token);

        // ✅ Fetch FULL user using token
        const res = await axiosInstance.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data?.user) {
          throw new Error("Failed to fetch user");
        }

        // ✅ Login with COMPLETE user object
        login(res.data.user, token);

        // ✅ Redirect to home
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Authentication failed. Redirecting to login...");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    handleOAuth();
  }, [login, navigate]);

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Signing you in with Google...</p>
    </div>
  );
};

export default OAuthSuccess;
