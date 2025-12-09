// src/services/authService.js
import axios from "axios";

const TOKEN_URL = "/kc-token"; // proxy προς Keycloak

function storage(remember) {
  return remember ? localStorage : sessionStorage;
}

export function getAccessToken() {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  // Αν είναι null, undefined ή empty string → δεν είσαι logged in
  if (!token || token === "null" || token === "undefined" || token.trim() === "") {
    return null;
  }

  return token;
}



export function getRefreshToken() {
  return (
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token")
  );
}

// θα κρατάμε και client_id / client_secret για refresh
function saveClientCredentials(remember, client_id, client_secret) {
  const s = storage(remember);
  if (client_id) s.setItem("kc_client_id", client_id);
  if (client_secret) s.setItem("kc_client_secret", client_secret);
}

function getClientCredentials() {
  // κοιτάμε και στα δύο (όπως κάνεις με τα tokens)
  const client_id =
    localStorage.getItem("kc_client_id") ||
    sessionStorage.getItem("kc_client_id");
  const client_secret =
    localStorage.getItem("kc_client_secret") ||
    sessionStorage.getItem("kc_client_secret");

  return { client_id, client_secret };
}

export function decodeJwt(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export async function login({
  username,
  password,
  client_id,
  client_secret,
  remember = true,
}) {
  const form = new URLSearchParams({
    grant_type: "password",
    username,
    password,
  });

  console.log("Login with:", { username, client_id, hasSecret: !!client_secret });

  const { data } = await axios.post(TOKEN_URL, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: {
      username: client_id,
      password: client_secret,
    },
  });

  const s = storage(remember);
  s.setItem("access_token", data.access_token);
  if (data.refresh_token) s.setItem("refresh_token", data.refresh_token);

  //αποθηκεύουμε client_id / secret για μελλοντικό refresh
  saveClientCredentials(remember, client_id, client_secret);

  return data;
}

// refreshTokens – προσπαθεί να πάρει νέο access_token
export async function refreshTokens() {
  console.log("%c[AUTH] Refreshing token…", "color: #00aaff; font-weight: bold;");
  const refresh_token = getRefreshToken();
  const { client_id, client_secret } = getClientCredentials();

  if (!refresh_token || !client_id || !client_secret) {
    throw new Error("No refresh token or client credentials available");
  }

  const form = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  const { data } = await axios.post(TOKEN_URL, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: {
      username: client_id,
      password: client_secret,
    },
  });

  // αποφασίζουμε αν τα tokens είναι σε local ή session
  const useLocal = !!localStorage.getItem("refresh_token");
  const s = useLocal ? localStorage : sessionStorage;

  s.setItem("access_token", data.access_token);
  if (data.refresh_token) s.setItem("refresh_token", data.refresh_token);

  return data.access_token;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("kc_client_id");
  localStorage.removeItem("kc_client_secret");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("kc_client_id");
  sessionStorage.removeItem("kc_client_secret");
}
