import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmpleadoBottomNav from "../components/EmpleadoBottomNav";

function EmpleadoExamen() {
  const { id } = useParams(); // id del examen
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`http://localhost:3001/examen/${id}`);
        const data = await res.json();

        // Agrupar por pregunta
        const mapa = new Map();
        data.forEach((item: any) => {
          if (!mapa.has(item.id_pregunta)) {
            mapa.set(item.id_pregunta, {
              id_pregunta: item.id_pregunta,
              pregunta: item.pregunta,
              opciones: [],
            });
          }
          mapa.get(item.id_pregunta).opciones.push({
            id_respuesta: item.id_respuesta,
            respuesta: item.respuesta,
          });
        });

        setPreguntas(Array.from(mapa.values()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) cargar();
  }, [id]);

  const seleccionarRespuesta = (id_pregunta: number, id_respuesta: number) => {
    setRespuestas((prev) => ({
      ...prev,
      [id_pregunta]: id_respuesta,
    }));
  };

  const siguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual((prev) => prev + 1);
    }
  };

  const anterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual((prev) => prev - 1);
    }
  };

  const enviarExamen = async () => {
    if (Object.keys(respuestas).length < preguntas.length) {
      const confirmar = window.confirm(
        "Aún tienes preguntas sin responder. ¿Deseas enviar de todas formas?"
      );
      if (!confirmar) return;
    }

    setEnviando(true);

    try {
      const payload = Object.keys(respuestas).map((id_pregunta) => ({
        id_pregunta: Number(id_pregunta),
        id_respuesta: respuestas[Number(id_pregunta)],
      }));

      const res = await fetch("http://localhost:3001/resolver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          id_examen: Number(id),
          respuestas: payload,
        }),
      });

      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error(error);
      alert("Error al enviar el examen");
    } finally {
      setEnviando(false);
    }
  };

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="empleado-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Cargando examen...</p>
      </div>
    );
  }

  // ========== RESULTADO ==========
  if (resultado) {
    const aprobado = resultado.calificacion >= 8;
    const porcentaje = Math.round((resultado.correctas / resultado.total) * 100);

    return (
      <div className="empleado-page">
        <div className="resultado-container">
          <div className={`resultado-icono ${aprobado ? "aprobado" : "reprobado"}`}>
            {aprobado ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            )}
          </div>

          <h2>{aprobado ? "¡Felicidades!" : "Sigue intentando"}</h2>
          <p className="resultado-mensaje">
            {aprobado
              ? "Has aprobado el examen"
              : "No alcanzaste la calificación mínima"}
          </p>

          {/* Círculo de porcentaje */}
          <div className="resultado-circulo">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${porcentaje}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">
                {porcentaje}%
              </text>
            </svg>
          </div>

          <p className="resultado-calificacion">
            Tu calificación: <strong>{Number(resultado.calificacion).toFixed(1)}</strong>
          </p>

          <div className="resultado-stats">
            <div className="stat-ok">
              <span>✔</span> Respuestas correctas: {resultado.correctas}
            </div>
            <div className="stat-bad">
              <span>✘</span> Respuestas incorrectas: {resultado.total - resultado.correctas}
            </div>
          </div>

          <button
            className="btn-continuar"
            onClick={() => navigate("/empleado")}
            style={{ marginTop: 24 }}
          >
            Volver al inicio
          </button>

          <button
            className="btn-secundario"
            onClick={() => {
              setResultado(null);
              setRespuestas({});
              setPreguntaActual(0);
            }}
          >
            Intentar de nuevo
          </button>
        </div>

        <EmpleadoBottomNav />
      </div>
    );
  }

  // ========== EXAMEN ==========
  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;
  const letras = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="empleado-page examen-page">
      {/* Header */}
      <div className="examen-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </button>
        <h1>Examen</h1>
        <div style={{ width: 36 }}></div>
      </div>

      {/* Progreso */}
      <div className="examen-progreso">
        <div className="examen-progreso-text">
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progreso}%` }}></div>
        </div>
      </div>

      {/* Pregunta */}
      <div className="examen-contenido">
        <h2 className="examen-pregunta">{pregunta?.pregunta}</h2>

        <div className="examen-opciones">
          {pregunta?.opciones.map((op: any, index: number) => {
            const seleccionada = respuestas[pregunta.id_pregunta] === op.id_respuesta;
            return (
              <button
                key={op.id_respuesta}
                className={`opcion-btn ${seleccionada ? "seleccionada" : ""}`}
                onClick={() =>
                  seleccionarRespuesta(pregunta.id_pregunta, op.id_respuesta)
                }
              >
                <span className="opcion-letra">{letras[index]}</span>
                <span className="opcion-texto">{op.respuesta}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="examen-nav">
        <button
          className="btn-nav"
          onClick={anterior}
          disabled={preguntaActual === 0}
        >
          Anterior
        </button>

        {preguntaActual < preguntas.length - 1 ? (
          <button className="btn-nav primario" onClick={siguiente}>
            Siguiente
          </button>
        ) : (
          <button
            className="btn-nav primario"
            onClick={enviarExamen}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar examen"}
          </button>
        )}
      </div>

      <EmpleadoBottomNav />
    </div>
  );
}

export default EmpleadoExamen;