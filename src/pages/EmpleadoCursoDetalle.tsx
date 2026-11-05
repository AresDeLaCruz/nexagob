import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EmpleadoBottomNav from "../components/EmpleadoBottomNav";
import { API_URL } from "../config"; 
function EmpleadoCursoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [curso, setCurso] = useState<any>(null);
  const [temas, setTemas] = useState<any[]>([]);
  const [progreso, setProgreso] = useState<any>({ porcentaje: 0, temas_vistos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // Cargar datos del curso (desde la lista de cursos con progreso)
        const resCursos = await fetch(
          `${API_URL}/cursos-con-progreso/${user.id_usuario}`
        );
        const dataCursos = await resCursos.json();
        const cursoEncontrado = dataCursos.find(
          (c: any) => String(c.id_curso) === String(id)
        );
        setCurso(cursoEncontrado);

        // Cargar temas
        const resTemas = await fetch(
          `${API_URL}/cursos/${id}/temas`
        );
        const dataTemas = await resTemas.json();
        setTemas(dataTemas);

        // Cargar progreso
        const resProg = await fetch(
          `${API_URL}/progreso/${user.id_usuario}/${id}`
        );
        const dataProg = await resProg.json();
        setProgreso(dataProg);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id_usuario && id) cargar();
  }, [id, user.id_usuario]);

  const yaVisto = (id_tema: number) =>
    progreso.temas_vistos?.includes(id_tema);

  const marcarComoVisto = async (id_tema: number) => {
    await fetch(`${API_URL}/progreso/marcar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_curso: Number(id),
        id_tema,
      }),
    });

    // Recargar progreso
    const resProg = await fetch(
      `${API_URL}/progreso/${user.id_usuario}/${id}`
    );
    const dataProg = await resProg.json();
    setProgreso(dataProg);
  };

  if (loading) {
    return (
      <div className="empleado-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="empleado-page">
        <div className="empleado-empty">
          <p>Curso no encontrado</p>
          <Link to="/empleado/cursos">Volver a cursos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="empleado-page">
      {/* ========== HEADER ========== */}
      <div className="detalle-header">
        <div className="detalle-header-top">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </button>
          <h1>Detalle del curso</h1>
          <div style={{ width: 36 }}></div>
        </div>
      </div>

      {/* ========== IMAGEN / BANNER DEL CURSO ========== */}
      <div className="detalle-banner">
        <div className="detalle-banner-placeholder">
          <span>🏛️</span>
        </div>
      </div>

      {/* ========== INFO DEL CURSO ========== */}
      <div className="detalle-info">
        <h2>{curso.titulo}</h2>
        <p className="detalle-descripcion">
          {curso.descripcion ||
            "Aprende las mejores prácticas para brindar una atención de calidad a la ciudadanía, fortaleciendo el servicio público."}
        </p>

        {/* Progreso */}
        <div className="detalle-progreso">
          <div className="detalle-progreso-header">
            <span>Tu progreso</span>
            <strong>{progreso.porcentaje || 0}%</strong>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progreso.porcentaje || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ========== MÓDULOS / TEMAS ========== */}
      <div className="detalle-modulos">
        <h3>Módulos</h3>

        {temas.length === 0 ? (
          <div className="empleado-empty">
            <p>Este curso aún no tiene módulos</p>
          </div>
        ) : (
          temas.map((tema, index) => {
            const visto = yaVisto(tema.id_tema);
            return (
              <div
                key={tema.id_tema}
                className={`modulo-item ${visto ? "completado" : ""}`}
                onClick={() => {
                  if (tema.archivo_pdf) {
                    // Abrir PDF o ir a contenido
                    window.open(
                      `${API_URL}/uploads/${tema.archivo_pdf}`,
                      "_blank"
                    );
                  }
                  // Marcar como visto al abrir
                  if (!visto) marcarComoVisto(tema.id_tema);
                }}
              >
                <div className="modulo-numero">
                  {visto ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="modulo-info">
                  <h4>{tema.titulo}</h4>
                  <span className={`modulo-estado ${visto ? "visto" : "pendiente"}`}>
                    {visto ? "Completado" : "Pendiente"}
                  </span>
                </div>

                <div className="modulo-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========== BOTÓN CONTINUAR ========== */}
      <div className="detalle-footer">
        <button
          className="btn-continuar"
          onClick={() => {
            // Ir al primer tema no visto o al primero
            const primerPendiente = temas.find((t) => !yaVisto(t.id_tema));
            if (primerPendiente?.archivo_pdf) {
              window.open(
                `${API_URL}/uploads/${primerPendiente.archivo_pdf}`,
                "_blank"
              );
              marcarComoVisto(primerPendiente.id_tema);
            }
          }}
        >
          Continuar curso
        </button>
      </div>

      <EmpleadoBottomNav />
    </div>
  );
}

export default EmpleadoCursoDetalle;