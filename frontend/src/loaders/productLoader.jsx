import { redirect } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const productLoader = async () => {
  const token = localStorage.getItem("token");

  // ✅ Redirect to auth if no token
  if (!token) {
    return redirect("/auth");
  }

  try {
    const res = await axiosInstance.get("/api/inventory");

    // ✅ Ensure array is always returned
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Inventory loader failed:", err);

    // ✅ Handle different error types
    if (err.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return redirect("/auth");
    }

    if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
      console.warn("Request timeout - Render cold start");
    }

    // ✅ Return empty array to prevent crashes
    return [];
  }
};

// ✅ Optional: Add a simpler loader for Home page that doesn't redirect
export const homeLoader = async () => {
  const token = localStorage.getItem("token");

  // Don't redirect on home page, just return empty
  if (!token) {
    return [];
  }

  try {
    const res = await axiosInstance.get("/api/inventory");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Home loader failed:", err);
    return [];
  }
};