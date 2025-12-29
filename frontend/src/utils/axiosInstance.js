import axios from "axios";

// ✅ Create axios instance with proper configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://groceryhub-7q1l.onrender.com",
  timeout: 30000, // 30 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Handle 401 errors (token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;