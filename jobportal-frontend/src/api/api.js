// src/api/api.js

import axios from "axios";

// Create an Axios instance with a base URL.
// The URL is pulled from your .env file (e.g., VITE_API_URL=http://127.0.0.1:8000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// This function runs BEFORE every request is sent out.
api.interceptors.request.use((config) => {
  // Get the authentication token from browser's local storage.
  const token = localStorage.getItem("token");

  // If a token exists, attach it to the request headers.
  // Django REST Framework's TokenAuthentication expects the header in this format.
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  // Return the updated config object.
  return config;
});

// --- Response Interceptor ---
// This function runs AFTER a response is received from the server.
api.interceptors.response.use(
  // If the response is successful (status code 2xx), just return it.
  (response) => response,

  // If the response is an error, handle it here.
  (error) => {
    // Check if the error is a 401 Unauthorized.
    // This typically means the token is expired, invalid, or the user logged out from another device.
    if (error.response && error.response.status === 401) {
      console.error("Session expired or invalid token. Logging out.");

      // IMPORTANT: Clear all local storage data.
      // This removes the token and any other user data.
      localStorage.clear();

      
      // redirect the user to the login page. This is a cleaner, more "React" way to handle it.
    }

    // Reject the promise so that the .catch() block in the component can handle the error.
    return Promise.reject(error);
  }
);

export default api;