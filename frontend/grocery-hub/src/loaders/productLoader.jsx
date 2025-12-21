export const productLoader = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/inventory");
    if (!res.ok) {
      throw new Error("Server error");
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
};


