import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmpleadoBottomNav from "../components/EmpleadoBottomNav";
import { API_URL } from "../config"; 
function EmpleadoDashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [examenes, setExamenes] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.id_usuario) {
      fetch(`${API_URL}/cursos-con-progreso/${user.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setCursos(data))
        .catch(console.error);
    }

    fetch(`${API_URL}/examenes`)
      .then((res) => res.json())
      .then((data) => setExamenes(data))
      .catch(console.error);
  }, [user.id_usuario]);

  // Cálculos para el dashboard
  const cursosEnProgreso = cursos.filter((c) => c.porcentaje > 0 && c.porcentaje < 100).length;
  const examenesPendientes = examenes.length; // puedes mejorar esta lógica después
  const progresoGeneral =
    cursos.length > 0
      ? Math.round(cursos.reduce((acc, c) => acc + (c.porcentaje || 0), 0) / cursos.length)
      : 0;

  const proximosPendientes = cursos
    .filter((c) => c.porcentaje < 100)
    .slice(0, 3);

  return (
    <div className="empleado-page">
      {/* ========== HEADER ========== */}
      <div className="empleado-header">
        <div className="empleado-header-top">
          <h1>COMUNICACIONES</h1>
          <div className="empleado-header-icons">
            <button aria-label="Notificaciones">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.10.20.0.3.78 1H1c.316-.323.555-.659.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="empleado-greeting">
          <h2>Hola, {user.nombre?.split(" ")[0] || "Usuario"}</h2>
          <p>¡Es un gusto verte de nuevo!</p>
        </div>
      </div>

      {/* ========== BANNER ========== */}
      <div className="empleado-banner">
        <div
          style={{
            height: "110px",
            background: "linear-gradient(135deg, #2c5f2d 0%, #1a3a1b 100%)",
            display: "flex",
            alignItems: "flex-end",
            padding: "14px 16px",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          Tu compromiso impulsa la conectividad del país
        </div>
      </div>

      {/* ========== STATS ========== */}
      <div className="empleado-stats">
        <div className="empleado-stat-card">
          <div className="stat-icon rojo">📚</div>
          <div className="stat-number">{cursosEnProgreso}</div>
          <div className="stat-label">Cursos en progreso</div>
        </div>

        <div className="empleado-stat-card">
          <div className="stat-icon naranja">📝</div>
          <div className="stat-number">{examenesPendientes}</div>
          <div className="stat-label">Exámenes pendientes</div>
        </div>
      </div>

      {/* ========== PROGRESO GENERAL ========== */}
      <div className="empleado-progress-card">
        <h3>📊 Tu progreso general</h3>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progresoGeneral}%` }}
          ></div>
        </div>
        <div className="progress-percent">{progresoGeneral}%</div>
      </div>
      {/* ========== PRÓXIMOS PENDIENTES (Cursos) ========== */}
      <div className="empleado-section">
        <div className="empleado-section-header">
          <h3>Próximos pendientes</h3>
          <Link to="/empleado/cursos">Ver todos</Link>
        </div>

        {proximosPendientes.length === 0 ? (
          <div className="empleado-empty">
            <div style={{ fontSize: "2rem" }}>🎉</div>
            <p>¡No tienes cursos pendientes!</p>
          </div>
        ) : (
          proximosPendientes.map((curso) => (
            <div key={curso.id_curso} className="curso-pendiente-card">
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  background: "linear-gradient(135deg, #6a0f2b, #9b2d4a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.8rem",
                  flexShrink: 0,
                }}
              >
                📖
              </div>
              <div className="curso-pendiente-info">
                <h4>{curso.titulo}</h4>
                <div className="estado">
                  {curso.porcentaje > 0
                    ? `En progreso · ${curso.porcentaje}%`
                    : "Pendiente"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== EXÁMENES PENDIENTES ========== */}
      <div className="empleado-section">
        <div className="empleado-section-header">
          <h3>Exámenes disponibles</h3>
          <Link to="/empleado/cursos">Ver todos</Link>
        </div>

        {examenes.length === 0 ? (
          <div className="empleado-empty">
            <div style={{ fontSize: "2rem" }}>📝</div>
            <p>No hay exámenes disponibles por ahora</p>
          </div>
        ) : (
          examenes.slice(0, 3).map((ex) => (
            <div
              key={ex.id_examen}
              className="curso-pendiente-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
  window.location.href = `/#/empleado/examen/${ex.id_examen}`;
}}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  background: "linear-gradient(135deg, #c45c26, #e07a3d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.8rem",
                  flexShrink: 0,
                }}
              >
                📝
              </div>
              <div className="curso-pendiente-info">
                <h4>{ex.titulo}</h4>
                <div className="estado" style={{ color: "#c45c26" }}>
                  Disponible para resolver
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== BOTTOM NAV ========== */}
      <EmpleadoBottomNav />
    </div>
  );
}

export default EmpleadoDashboard;