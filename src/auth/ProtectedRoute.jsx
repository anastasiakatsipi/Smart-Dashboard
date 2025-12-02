import { Navigate } from "react-router-dom";
import { getAccessToken, decodeJwt } from "@/services/authService";

export default function ProtectedRoute({ children, roles }) {
  const token = getAccessToken();
  const decoded = decodeJwt(token);

  // Αν δεν υπάρχει token → redirect login
  if (!token) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Βγάζουμε ΟΛΟΥΣ τους Keycloak ρόλους
  const userRoles = (decoded?.realm_access?.roles || [])
    .map(r => r.toLowerCase());

  // Αν η σελίδα έχει καθορισμένους ρόλους
  if (roles && roles.length > 0) {
    const normalizedRoles = roles.map(r => r.toLowerCase());

    const hasAccess = normalizedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return <Navigate to="/dashboard/403" replace />;
    }
  }

  return children;
}
