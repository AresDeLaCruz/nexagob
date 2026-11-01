import { HashRouter, Routes, Route } from "react-router-dom";
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


function App() {
  return (
    <HashRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route
 path="/privacidad"
 element={<Privacidad />}
/>
<Route
  path="/terminos"
  element={<Terminos />}
/>
<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
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
  path="/mis-calificaciones"
  element={
    <ProtectedRoute rol={2}>
      <MisCalificaciones />
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
        </Routes>
      </div>
    </HashRouter>
    
  );
  
}

export default App;