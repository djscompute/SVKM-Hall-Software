import React from "react";
import useAuthStore from "../store/authStore";
import Login from "./login/Login";

type Props = {
  children: React.ReactNode;
};
function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  if (!isAuthenticated) return <Login />;
  return <>{children}</>;
}

export default ProtectedRoute;
