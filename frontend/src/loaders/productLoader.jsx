import { redirect } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const productLoader = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/auth");
  }

  try {
    const res = await axiosInstance.get("/api/inventory");

    // ✅ Ensure array
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return redirect("/auth");
    }

    console.error("Inventory loader failed:", err);
    return []; // 🔥 prevents reduce crash
  }
};
