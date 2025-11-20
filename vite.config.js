import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    proxy: {
      // Κάνε POST στο /kc-token και ο Vite θα το προωθεί προς Keycloak
      "/kc-token": {  ///kc-token → Keycloak token endpoint Ό,τι request ξεκινά με /kc-token θα περάσει από αυτόν τον κανόνα
        target: "https://snap4.rhodes.gr",
        changeOrigin: true, //Αλλάζει το Host header του request ώστε να ταιριάζει με το target. Πολλοί servers το απαιτούν.
        // Σβήνει το prefix και το στέλνει στο πραγματικό KC endpoint
        rewrite: (p) =>
          p.replace(
            /^\/kc-token/,  //αυτό replace 
            "/auth/realms/master/protocol/openid-connect/token" //με αυτό
          ),
        secure: true, // άφησέ το true (https)
      },
       "/snap": {
          target: "https://snap4.rhodes.gr",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/snap/, ""),
        },

        "/super": {
          target: "https://snap4.rhodes.gr/ServiceMap/api/v1/iot-search/",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/super/, ""),
        },
    },
  },
});
