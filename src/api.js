// src/api.js
import axios from "axios";

// Adjust this to your FastAPI backend URL
// const API_BASE_URL = "http://172.12.13.118:8010";
const API_BASE_URL = "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


