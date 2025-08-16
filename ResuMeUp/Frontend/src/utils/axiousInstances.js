// utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001", // your backend
  withCredentials: true, // 👈 important for cookies
});

export default instance;
