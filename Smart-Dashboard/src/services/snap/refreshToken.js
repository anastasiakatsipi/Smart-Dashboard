import api from "axios";
import { AuthContext } from "../../auth/AuthContext";
import { useContext } from "react";

const auth = useContext(AuthContext);

api.interceptors.request.use(async (config) => {
  let token = auth.token;

  if (token) {
    const decoded = decodeJwt(token);
    const now = Date.now() / 1000;

    if (decoded.exp - now < 30) {
        console.log("%c[AUTH] Access token expired → refreshing…", "color: orange; font-weight: bold;");
        token = await auth.refresh(); 
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
