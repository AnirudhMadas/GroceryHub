import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      login({ email });
      navigate("/", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [login, navigate, params]);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
