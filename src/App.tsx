import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmpleadoDashboard from "./pages/EmpleadoDashboard";
import Navbar from "./components/Navbar";
import AdminExamenes from "./pages/AdminExamenes";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRegistrar from "./pages/AdminRegistrar";
import AdminEmpleados from "./pages/AdminEmpleados";
import MisCalificaciones from "./pages/MisCalificaciones";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import AdminCursos from "./pages/AdminCursos";
import EmpleadoCursos from "./pages/EmpleadoCursos";
import EmpleadoCursoDetalle from "./pages/EmpleadoCursoDetalle";
import EmpleadoExamen from "./pages/EmpleadoExamen";
import EmpleadoPerfil from "./pages/EmpleadoPerfil";

function AppContent() {
  const location = useLocation();

  // Rutas donde NO queremos mostrar el Navbar
  const hideNavbarRoutes = [
    "/login",
    "/forgot-password",
    "/register",
    "/reset-password",
  ];

  const hideNavbar = hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      
      <div className={hideNavbar ? "" : "container mt-4"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rol={1}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-examenes"
            element={
              <ProtectedRoute rol={1}>
                <AdminExamenes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-registrar"
            element={
              <ProtectedRoute rol={1}>
                <AdminRegistrar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-empleados"
            element={
              <ProtectedRoute rol={1}>
                <AdminEmpleados />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-cursos"
            element={
              <ProtectedRoute rol={1}>
                <AdminCursos />
              </ProtectedRoute>
            }
          />

          {/* 🔐 EMPLEADO */}
          <Route
            path="/empleado"
            element={
              <ProtectedRoute rol={2}>
                <EmpleadoDashboard />
              </ProtectedRoute>
            }
          />
{/* EMPLEADO - nuevas rutas */}
<Route
  path="/empleado/cursos"
  element={
    <ProtectedRoute rol={2}>
      <EmpleadoCursos />
    </ProtectedRoute>
  }
/>


<Route
  path="/empleado/curso/:id"
  element={
    <ProtectedRoute rol={2}>
      <EmpleadoCursoDetalle />
    </ProtectedRoute>
  }
/>

<Route
  path="/empleado/perfil"
  element={
    <ProtectedRoute rol={2}>
      <EmpleadoPerfil />
    </ProtectedRoute>
  }
/>

<Route
  path="/empleado/examen/:id"
  element={
    <ProtectedRoute rol={2}>
      <EmpleadoExamen />
    </ProtectedRoute>
  }
/>
          <Route
            path="/mis-calificaciones"
            element={
              <ProtectedRoute rol={2}>
                <MisCalificaciones />
              </ProtectedRoute>
            }
          />

          


        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;