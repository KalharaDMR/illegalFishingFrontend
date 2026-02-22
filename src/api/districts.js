import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getDistricts = async () => {
  try {
    const response = await instance.get("/districts");
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};