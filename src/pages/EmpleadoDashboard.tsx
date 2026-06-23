import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EmpleadoDashboard() {
  const [examenes, setExamenes] = useState<any[]>([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState<any[]>([]);
  const [respuestas, setRespuestas] = useState<any>({});
  const [resultado, setResultado] = useState<any>(null);
  const [idExamenActual, setIdExamenActual] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* =========================
     🔹 CARGAR EXÁMENES
  ========================= */
  useEffect(() => {
    fetch("http://localhost:3001/examenes")
      .then(res => res.json())
      .then(data => setExamenes(data));
  }, []);

  /* =========================
     🔹 CARGAR EXAMEN
  ========================= */
  const cargarExamen = async (id: number) => {
    const res = await fetch(`http://localhost:3001/examen/${id}`);
    const data = await res.json();

    setExamenSeleccionado(data);
    setIdExamenActual(id);
    setRespuestas({});
    setResultado(null);
  };

  /* =========================
     🔹 SELECCIONAR RESPUESTA
  ========================= */
  const seleccionarRespuesta = (id_pregunta: number, id_respuesta: number) => {
    setRespuestas({
      ...respuestas,
      [id_pregunta]: id_respuesta
    });
  };

  /* =========================
     🔹 ENVIAR EXAMEN
  ========================= */
  const enviarExamen = async () => {
    const payload = Object.keys(respuestas).map(id_pregunta => ({
      id_pregunta,
      id_respuesta: respuestas[id_pregunta]
    }));

    const res = await fetch("http://localhost:3001/resolver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_examen: idExamenActual,
        respuestas: payload
      })
    });

    const data = await res.json();
    setResultado(data);
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* 🔴 SIDEBAR */}
        <div className="col-md-3 bg-light vh-100 p-4">
          <h5 className="mb-4">📚 Cursos</h5>

          {examenes.map((ex, i) => (
            <div key={i} className="mb-3">

              <button
                className="btn btn-danger w-100 mb-2"
                onClick={() => cargarExamen(ex.id_examen)}
              >
                {ex.titulo}
              </button>

              <div className="ms-3 text-muted">
                <div>• Tema 1</div>
                <div>• Tema 2</div>
                <div>📝 Examen</div>
              </div>

            </div>
          ))}
        </div>

        {/* 🟡 CONTENIDO */}
        <div className="col-md-9 p-5">

          <h1
            className="text-center mb-5"
            style={{ fontSize: "60px", color: "#2f5d3a" }}
          >
            Bienvenido {user.nombre}
          </h1>

          {/* 🔥 CARD MIS CALIFICACIONES */}
          <div className="row mb-4">
            <div className="col-md-4">
              <Link to="/mis-calificaciones" style={{ textDecoration: "none" }}>
                <div
                  className="card shadow-lg border-0 text-center p-4"
                  style={{ cursor: "pointer" }}
                >
                  <h5>📊 Mis Calificaciones</h5>
                  <p>Consulta tus resultados y descarga tu certificado</p>
                </div>
              </Link>
            </div>
          </div>

          {/* 📝 EXAMEN */}
          {examenSeleccionado.length > 0 && (
            <div className="mt-4">
              <h4>Resolver examen</h4>

              {[...new Map(examenSeleccionado.map(p => [p.id_pregunta, p])).values()]
                .map((pregunta: any) => (
                  <div key={pregunta.id_pregunta} className="card p-3 mb-3">
                    <strong>{pregunta.pregunta}</strong>

                    {examenSeleccionado
                      .filter(r => r.id_pregunta === pregunta.id_pregunta)
                      .map((op: any) => (
                        <div key={op.id_respuesta}>
                          <input
                            type="radio"
                            name={`pregunta-${pregunta.id_pregunta}`}
                            onChange={() =>
                              seleccionarRespuesta(
                                pregunta.id_pregunta,
                                op.id_respuesta
                              )
                            }
                          />
                          {op.respuesta}
                        </div>
                      ))}
                  </div>
                ))}

              <button className="btn btn-success" onClick={enviarExamen}>
                Enviar examen
              </button>
            </div>
          )}

          {/* 📊 RESULTADO */}
          {resultado && (
            <div className="alert alert-info mt-4">
              <p>Correctas: {resultado.correctas}</p>
              <p>Calificación: {resultado.calificacion.toFixed(2)}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default EmpleadoDashboard;