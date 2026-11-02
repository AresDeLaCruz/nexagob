import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EmpleadoDashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);
  const [temas, setTemas] = useState<any[]>([]);
  const [progreso, setProgreso] = useState<any>({ porcentaje: 0, temas_vistos: [] });
  const [examenes, setExamenes] = useState<any[]>([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState<any[]>([]);
  const [respuestas, setRespuestas] = useState<any>({});
  const [resultado, setResultado] = useState<any>(null);
  const [idExamenActual, setIdExamenActual] = useState<number | null>(null);
  const [vistaActual, setVistaActual] = useState<"cursos" | "examen">("cursos");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Cargar cursos con progreso
  useEffect(() => {
    if (user.id_usuario) {
      fetch(`http://localhost:3001/cursos-con-progreso/${user.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setCursos(data));
    }
  }, [user.id_usuario]);

  // Cargar exámenes (para poder resolverlos cuando quiera)
  useEffect(() => {
    fetch("http://localhost:3001/examenes")
      .then((res) => res.json())
      .then((data) => setExamenes(data));
  }, []);

  // Cuando selecciona un curso
  const seleccionarCurso = async (curso: any) => {
    setCursoSeleccionado(curso);
    setVistaActual("cursos");
    setExamenSeleccionado([]);
    setResultado(null);

    // Cargar temas del curso
    const resTemas = await fetch(`http://localhost:3001/cursos/${curso.id_curso}/temas`);
    const dataTemas = await resTemas.json();
    setTemas(dataTemas);

    // Cargar progreso
    const resProg = await fetch(
      `http://localhost:3001/progreso/${user.id_usuario}/${curso.id_curso}`
    );
    const dataProg = await resProg.json();
    setProgreso(dataProg);
  };

  // Marcar tema como visto
  const marcarComoVisto = async (id_tema: number) => {
    await fetch("http://localhost:3001/progreso/marcar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_curso: cursoSeleccionado.id_curso,
        id_tema,
      }),
    });

    // Actualizar progreso local
    const resProg = await fetch(
      `http://localhost:3001/progreso/${user.id_usuario}/${cursoSeleccionado.id_curso}`
    );
    const dataProg = await resProg.json();
    setProgreso(dataProg);

    // Actualizar lista de cursos (para el % general)
    const resCursos = await fetch(
      `http://localhost:3001/cursos-con-progreso/${user.id_usuario}`
    );
    const dataCursos = await resCursos.json();
    setCursos(dataCursos);
  };

  // Cargar examen
  const cargarExamen = async (id: number) => {
    const res = await fetch(`http://localhost:3001/examen/${id}`);
    const data = await res.json();
    setExamenSeleccionado(data);
    setIdExamenActual(id);
    setRespuestas({});
    setResultado(null);
    setVistaActual("examen");
  };

  const seleccionarRespuesta = (id_pregunta: number, id_respuesta: number) => {
    setRespuestas({
      ...respuestas,
      [id_pregunta]: id_respuesta,
    });
  };

  const enviarExamen = async () => {
    const payload = Object.keys(respuestas).map((id_pregunta) => ({
      id_pregunta,
      id_respuesta: respuestas[id_pregunta],
    }));

    const res = await fetch("http://localhost:3001/resolver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_examen: idExamenActual,
        respuestas: payload,
      }),
    });

    const data = await res.json();
    setResultado(data);
  };

  const yaVisto = (id_tema: number) => progreso.temas_vistos?.includes(id_tema);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* ========== SIDEBAR ========== */}
        <div className="col-md-3 bg-light min-vh-100 p-4 border-end">
          <h5 className="mb-4">📚 Mis Cursos</h5>

          {cursos.length === 0 && (
            <p className="text-muted small">Aún no hay cursos disponibles</p>
          )}

          {cursos.map((curso) => (
            <div
              key={curso.id_curso}
              className={`card mb-3 p-3 ${
                cursoSeleccionado?.id_curso === curso.id_curso
                  ? "border-primary border-2"
                  : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => seleccionarCurso(curso)}
            >
              <strong className="d-block mb-1">{curso.titulo}</strong>

              {/* Barra de progreso */}
              <div className="progress mb-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${curso.porcentaje}%` }}
                ></div>
              </div>
              <small className="text-muted">{curso.porcentaje}% completado</small>
            </div>
          ))}

          <hr />

          <h6 className="mt-4 mb-3">📝 Exámenes</h6>
          {examenes.map((ex) => (
            <button
              key={ex.id_examen}
              className="btn btn-outline-danger btn-sm w-100 mb-2"
              onClick={() => cargarExamen(ex.id_examen)}
            >
              {ex.titulo}
            </button>
          ))}
        </div>

        {/* ========== CONTENIDO PRINCIPAL ========== */}
        <div className="col-md-9 p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: "#2f5d3a" }}>
              Bienvenido, {user.nombre}
            </h2>

            <Link to="/mis-calificaciones" className="btn btn-outline-primary">
              📊 Mis Calificaciones
            </Link>
          </div>

          {/* ========== VISTA DE CURSO ========== */}
          {vistaActual === "cursos" && cursoSeleccionado && (
            <div>
              <h3 className="mb-3">{cursoSeleccionado.titulo}</h3>
              <p className="text-muted">{cursoSeleccionado.descripcion}</p>

              {/* Progreso del curso */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Progreso del curso</span>
                  <strong>{progreso.porcentaje}%</strong>
                </div>
                <div className="progress" style={{ height: "12px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progreso.porcentaje}%` }}
                  ></div>
                </div>
              </div>

              <h5 className="mb-3">Temas del curso</h5>

              {temas.length === 0 && (
                <div className="alert alert-info">
                  Este curso aún no tiene temas cargados.
                </div>
              )}

              {temas.map((tema) => (
                <div
                  key={tema.id_tema}
                  className="card mb-3 p-3 shadow-sm"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        {tema.titulo}
                        {yaVisto(tema.id_tema) && (
                          <span className="badge bg-success ms-2">Visto ✓</span>
                        )}
                      </h6>

                      {tema.archivo_pdf && (
                        <a
                          href={`http://localhost:3001/uploads/${tema.archivo_pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary mt-1"
                        >
                          📄 Abrir PDF
                        </a>
                      )}
                    </div>

                    {!yaVisto(tema.id_tema) ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => marcarComoVisto(tema.id_tema)}
                      >
                        Marcar como visto
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Completado
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========== VISTA DE EXAMEN ========== */}
          {vistaActual === "examen" && examenSeleccionado.length > 0 && (
            <div>
              <button
                className="btn btn-link mb-3"
                onClick={() => setVistaActual("cursos")}
              >
                ← Volver a cursos
              </button>

              <h4 className="mb-4">Resolver examen</h4>

              {[
                ...new Map(
                  examenSeleccionado.map((p) => [p.id_pregunta, p])
                ).values(),
              ].map((pregunta: any) => (
                <div key={pregunta.id_pregunta} className="card p-3 mb-3">
                  <strong className="mb-2 d-block">{pregunta.pregunta}</strong>

                  {examenSeleccionado
                    .filter((r) => r.id_pregunta === pregunta.id_pregunta)
                    .map((op: any) => (
                      <div key={op.id_respuesta} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`pregunta-${pregunta.id_pregunta}`}
                          id={`resp-${op.id_respuesta}`}
                          onChange={() =>
                            seleccionarRespuesta(
                              pregunta.id_pregunta,
                              op.id_respuesta
                            )
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`resp-${op.id_respuesta}`}
                        >
                          {op.respuesta}
                        </label>
                      </div>
                    ))}
                </div>
              ))}

              <button className="btn btn-success btn-lg" onClick={enviarExamen}>
                Enviar examen
              </button>

              {resultado && (
                <div className="alert alert-info mt-4">
                  <h5>Resultado</h5>
                  <p>Correctas: {resultado.correctas} de {resultado.total}</p>
                  <p>
                    <strong>
                      Calificación: {resultado.calificacion.toFixed(2)}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mensaje inicial */}
          {vistaActual === "cursos" && !cursoSeleccionado && (
            <div className="text-center text-muted mt-5">
              <h4>Selecciona un curso del menú izquierdo</h4>
              <p>o elige un examen para resolverlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmpleadoDashboard;