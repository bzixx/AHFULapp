import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Blocks access unless user.email_verified === true
 */
export function RequireVerifiedEmail() {
  const user = useSelector((state) => state.auth.user);

  // Still loading auth state (optional safety)
  if (!user) {
    return null; // or loading spinner
  }

  if (!user.email_verified) {
    return <Navigate to="/NotVerified" replace />;
  }

  return <Outlet />;
}