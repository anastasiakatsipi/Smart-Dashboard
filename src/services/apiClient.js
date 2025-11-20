// src/services/apiClient.js
import axios from "axios";
import { getAccessToken, refreshTokens, logout as svcLogout } from "./authService";

// -----------------------------------------------------------------------------
// 1️⃣ Δημιουργία axios instances για Snap & Super
// -----------------------------------------------------------------------------

export const apiSnap = axios.create({
  baseURL: "/snap",
});

export const apiSuper = axios.create({
  baseURL: "/super",
});

// -----------------------------------------------------------------------------
// 2️⃣ Common request interceptor (μπαίνει token)
// -----------------------------------------------------------------------------

function attachAuthToken(config) {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

apiSnap.interceptors.request.use(attachAuthToken);
apiSuper.interceptors.request.use(attachAuthToken);

// -----------------------------------------------------------------------------
// 3️⃣ Refresh token ONLY για SNAP API (όπως πρέπει)
// -----------------------------------------------------------------------------

apiSnap.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    // Αν δεν είναι 401 → πέτα error
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Αν έχει ήδη προσπαθήσει μία φορά → πέτα error
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Κάνουμε refresh
      const newAccessToken = await refreshTokens();

      // Ξαναβάζουμε το νέο token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Ξανακάνουμε το request
      return apiSnap(originalRequest);

    } catch (err) {
      console.error("❌ Refresh token failed:", err);

      svcLogout();
      window.location.href = "/";
      return Promise.reject(err);
    }
  }
);
