import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, rol }: any) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (rol && user.id_rol !== rol) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;