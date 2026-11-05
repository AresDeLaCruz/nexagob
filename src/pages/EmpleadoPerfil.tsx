import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmpleadoBottomNav from "../components/EmpleadoBottomNav";
import { API_URL } from "../config"; 
function EmpleadoPerfil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [cursos, setCursos] = useState<any[]>([]);
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    if (user.id_usuario) {
      // Cursos
      fetch(`${API_URL}/cursos-con-progreso/${user.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setCursos(data))
        .catch(console.error);

      // Resultados de exámenes
      fetch(`${API_URL}/resultados/${user.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setResultados(data))
        .catch(console.error);
    }
  }, [user.id_usuario]);

  const cursosCompletados = cursos.filter((c) => c.porcentaje === 100).length;

  // Mejor intento por examen
  const resultadosUnicos = Object.values(
    resultados.reduce((acc: any, curr: any) => {
      if (
        !acc[curr.id_examen] ||
        Number(curr.calificacion) > Number(acc[curr.id_examen].calificacion)
      ) {
        acc[curr.id_examen] = curr;
      }
      return acc;
    }, {})
  );

  const certificadosObtenidos = resultadosUnicos.filter(
    (r: any) => Number(r.calificacion) >= 8
  ).length;

  const progresoGeneral =
    cursos.length > 0
      ? Math.round(
          cursos.reduce((acc, c) => acc + (c.porcentaje || 0), 0) / cursos.length
        )
      : 0;

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="empleado-page">
      {/* ========== HEADER ========== */}
      <div className="perfil-header">
        <div className="perfil-header-top">
          <div style={{ width: 36 }}></div>
          <h1>COMUNICACIONES</h1>
          <button className="btn-icon" onClick={cerrarSesion} title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ========== INFO USUARIO ========== */}
      <div className="perfil-card">
        <div className="perfil-avatar">
          {user.nombre?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h2>{user.nombre || "Usuario"}</h2>
        <p className="perfil-rol">
          {user.puesto || "Analista de Atención Ciudadana"}
        </p>
        <p className="perfil-depto">
          {user.departamento || "Departamento de Servicios Públicos"}
        </p>
      </div>

      {/* ========== STATS ========== */}
      <div className="perfil-stats">
        <div className="perfil-stat">
          <div className="perfil-stat-number">{cursosCompletados}</div>
          <div className="perfil-stat-label">Cursos completados</div>
        </div>
        <div className="perfil-stat">
          <div className="perfil-stat-number">{certificadosObtenidos}</div>
          <div className="perfil-stat-label">Certificados obtenidos</div>
        </div>
      </div>

      {/* ========== PROGRESO ========== */}
      <div className="perfil-progreso-card">
        <div className="perfil-progreso-header">
          <span>Mi progreso</span>
          <strong>{progresoGeneral}%</strong>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progresoGeneral}%` }}
          ></div>
        </div>
      </div>

      {/* ========== MENÚ ========== */}
      <div className="perfil-menu">
        <Link to="/empleado/cursos" className="perfil-menu-item">
          <div className="menu-icon">📚</div>
          <span>Mis cursos</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </Link>

        <Link to="/mis-calificaciones" className="perfil-menu-item">
          <div className="menu-icon">📝</div>
          <span>Mis exámenes</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </Link>

        <Link to="/mis-calificaciones" className="perfil-menu-item">
          <div className="menu-icon">🏆</div>
          <span>Mis logros / Certificados</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </Link>
      </div>

      {/* ========== CERRAR SESIÓN ========== */}
      <div className="perfil-logout">
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      <EmpleadoBottomNav />
    </div>
  );
}

export default EmpleadoPerfil;