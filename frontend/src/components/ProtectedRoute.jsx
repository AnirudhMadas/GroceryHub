import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  // ✅ Wait for auth to load
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

const token = localStorage.getItem("token");
if (!token || !user) {
  return <Navigate to="/auth" replace />;
}


  return children;
};

export default ProtectedRoute;