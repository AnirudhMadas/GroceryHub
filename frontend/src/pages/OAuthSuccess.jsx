import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
      navigate("/auth");
      return;
    }

    // ✅ Store BOTH
    login({ email }, token);

    // ✅ Replace history so loader doesn't rerun OAuth
    navigate("/", { replace: true });
  }, [login, navigate]);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
