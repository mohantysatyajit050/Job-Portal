// src/api/api.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server responds with a 401 Unauthorized, the token is bad.
    if (error.response && error.response.status === 401) {
      console.error("Session expired or invalid token.");
      localStorage.clear(); // Clear all local storage
      // --- KEY CHANGE ---
      // REMOVED the problematic redirect.
      // The ProtectedRoute component in App.jsx will handle redirecting the user.
      // -------------------
    }
    return Promise.reject(error);
  }
);

export default api;