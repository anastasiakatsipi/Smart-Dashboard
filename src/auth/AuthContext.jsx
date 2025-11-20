// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  login as svcLogin,
  logout as svcLogout,
  getAccessToken,
  decodeJwt,
} from "../services/authService.js";

export const AuthContext = createContext(null);

// -------------------------------
//   Helper: Validate JWT Token
// -------------------------------
function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return false;

    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAccessToken());
  const [user, setUser] = useState(() => {
    const t = getAccessToken();
    return t && isTokenValid(t) ? decodeJwt(t) : null;
  });

  // Update user if token changes
  useEffect(() => {
    if (token && isTokenValid(token)) {
      setUser(decodeJwt(token));
    } else {
      setUser(null);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: isTokenValid(token),

      async login({
        username,
        password,
        client_id,
        client_secret,
        remember = true,
      }) {
        const data = await svcLogin({
          username,
          password,
          client_id,
          client_secret,
          remember,
        });

        setToken(data.access_token);
        return data;
      },

      logout() {
        svcLogout();
        setToken(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
