export const productLoader = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/inventory", {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 REQUIRED
      },
    });

    if (res.status === 401) {
      throw new Error("Unauthorized");
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
