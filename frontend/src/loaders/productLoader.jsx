import { redirect } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const productLoader = async () => {
  const token = localStorage.getItem("token");

  // 🔐 Not logged in → go to auth
  if (!token) {
    return redirect("/auth");
  }

  try {
    const res = await axiosInstance.get("/api/inventory");
    return res.data;
  } catch (err) {
    console.error("Inventory loader failed:", err);

    // 🔐 Token expired / invalid
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      return redirect("/auth");
    }

    throw err;
  }
};
