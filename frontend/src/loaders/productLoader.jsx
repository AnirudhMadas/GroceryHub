import { redirect } from "react-router-dom";

export const productLoader = async () => {
  const token = localStorage.getItem("token");

  // 🔐 If not logged in, redirect
  if (!token) {
    return redirect("/auth");
  }

  try {
    const res = await fetch("http://localhost:5000/api/inventory", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔐 Token invalid or expired
    if (res.status === 401) {
      localStorage.removeItem("token");
      return redirect("/auth");
    }

    if (!res.ok) {
      throw new Error("Server error");
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};
