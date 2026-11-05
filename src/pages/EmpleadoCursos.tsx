import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmpleadoBottomNav from "../components/EmpleadoBottomNav";
import { API_URL } from "../config"; 
type Filtro = "todos" | "en_progreso" | "pendientes" | "completados";

function EmpleadoCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.id_usuario) {
      fetch(`${API_URL}/cursos-con-progreso/${user.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setCursos(data))
        .catch(console.error);
    }
  }, [user.id_usuario]);

  // Filtrar cursos
  const cursosFiltrados = cursos.filter((curso) => {
    const coincideBusqueda = curso.titulo
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    if (!coincideBusqueda) return false;

    const porcentaje = curso.porcentaje || 0;

    switch (filtro) {
      case "en_progreso":
        return porcentaje > 0 && porcentaje < 100;
      case "pendientes":
        return porcentaje === 0;
      case "completados":
        return porcentaje === 100;
      default:
        return true;
    }
  });

  const getEstadoBadge = (porcentaje: number) => {
    if (porcentaje === 100) {
      return <span className="badge-estado completado">Completado · 100%</span>;
    }
    if (porcentaje > 0) {
      return <span className="badge-estado progreso">En progreso · {porcentaje}%</span>;
    }
    return <span className="badge-estado pendiente">Pendiente · 0%</span>;
  };

  return (
    <div className="empleado-page">
      {/* ========== HEADER ========== */}
      <div className="cursos-header">
        <div className="cursos-header-top">
          <Link to="/empleado" className="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </Link>
          <h1>Cursos</h1>
          <div style={{ width: 36 }}></div> {/* spacer */}
        </div>

        {/* Buscador */}
        <div className="cursos-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* ========== FILTROS ========== */}
      <div className="cursos-filtros">
        <button
          className={filtro === "todos" ? "activo" : ""}
          onClick={() => setFiltro("todos")}
        >
          Todos
        </button>
        <button
          className={filtro === "en_progreso" ? "activo" : ""}
          onClick={() => setFiltro("en_progreso")}
        >
          En progreso
        </button>
        <button
          className={filtro === "pendientes" ? "activo" : ""}
          onClick={() => setFiltro("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={filtro === "completados" ? "activo" : ""}
          onClick={() => setFiltro("completados")}
        >
          Completados
        </button>
      </div>

      {/* ========== LISTA DE CURSOS ========== */}
      <div className="cursos-lista">
        {cursosFiltrados.length === 0 ? (
          <div className="empleado-empty">
            <div style={{ fontSize: "2.5rem" }}>📚</div>
            <p>No se encontraron cursos</p>
          </div>
        ) : (
          cursosFiltrados.map((curso) => (
            <Link
              key={curso.id_curso}
              to={`/empleado/curso/${curso.id_curso}`}
              className="curso-card"
            >
              <div className="curso-card-img">
                <div className="curso-card-placeholder">
                  {curso.porcentaje === 100 ? "✅" : "📖"}
                </div>
              </div>

              <div className="curso-card-body">
                <h3>{curso.titulo}</h3>
                {getEstadoBadge(curso.porcentaje || 0)}
              </div>

              {curso.porcentaje === 100 && (
                <div className="curso-card-check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </div>
              )}
            </Link>
          ))
        )}
      </div>

      <EmpleadoBottomNav />
    </div>
  );
}

export default EmpleadoCursos;