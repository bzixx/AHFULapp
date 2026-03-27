import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { authLogout } from "./Pages/Login/AuthSlice";

export function AuthRouteCheck({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  const now = Math.floor(Date.now() / 1000);

  if (user?.last_login_expire && user.last_login_expire < now) {
    dispatch(authLogout());
    return <Navigate to="/Login" replace />;
  }

  return children;
}
