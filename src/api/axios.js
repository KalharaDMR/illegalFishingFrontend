import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getDistricts = async () => {
  try {
    const response = await instance.get("/districts");
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

export default instance;