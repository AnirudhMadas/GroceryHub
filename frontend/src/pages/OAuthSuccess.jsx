import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        if (!token || !email) {
          console.error("Missing OAuth parameters");
          setError("Authentication failed. Missing credentials.");
          setTimeout(() => navigate("/auth"), 2000);
          return;
        }

        // ✅ Store token first
        localStorage.setItem("token", token);
        
        // ✅ Store user data
        const userData = { email };
        localStorage.setItem("user", JSON.stringify(userData));
        
        // ✅ Update auth context
        login(userData, token);

        // ✅ Short delay before redirect to ensure state updates
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
        
      } catch (err) {
        console.error("OAuth error:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    handleOAuth();
  }, [login, navigate]);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>Signing you in...</p>
    </div>
  );
};

export default OAuthSuccess;