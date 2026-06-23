import { useEffect, useState } from "react";

function AdminExamenes() {
  const [examenes, setExamenes] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [preguntas, setPreguntas] = useState<any[]>([]);

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState<number | null>(null);

  /* =========================
     🔹 OBTENER EXÁMENES
  ========================= */
  const obtenerExamenes = async () => {
    const res = await fetch("http://localhost:3001/examenes");
    const data = await res.json();
    setExamenes(data);
  };

  useEffect(() => {
    obtenerExamenes();
  }, []);

  /* =========================
     ➕ AGREGAR PREGUNTA
  ========================= */
  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      {
        pregunta: "",
        respuestas: [
          { texto: "", correcta: false },
          { texto: "", correcta: false },
          { texto: "", correcta: false }
        ]
      }
    ]);
  };

  /* =========================
     ✏️ EDITAR PREGUNTA/RESPUESTA
  ========================= */
  const cambiarPregunta = (index: number, value: string) => {
    const nuevas = [...preguntas];
    nuevas[index].pregunta = value;
    setPreguntas(nuevas);
  };

  const cambiarRespuesta = (pIndex: number, rIndex: number, value: string) => {
    const nuevas = [...preguntas];
    nuevas[pIndex].respuestas[rIndex].texto = value;
    setPreguntas(nuevas);
  };

  const marcarCorrecta = (pIndex: number, rIndex: number) => {
    const nuevas = [...preguntas];

    nuevas[pIndex].respuestas.forEach((r: any, i: number) => {
      r.correcta = i === rIndex;
    });

    setPreguntas(nuevas);
  };

  /* =========================
     ➕ CREAR EXAMEN
  ========================= */
  const crearExamen = async () => {
    const res = await fetch("http://localhost:3001/examenes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, id_curso: null }),
    });

    const data = await res.json();
    const id_examen = data.id_examen;

    for (let p of preguntas) {
      const resPregunta = await fetch("http://localhost:3001/preguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_examen,
          pregunta: p.pregunta,
        }),
      });

      const dataPregunta = await resPregunta.json();

      await fetch("http://localhost:3001/respuestas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_pregunta: dataPregunta.id_pregunta,
          respuestas: p.respuestas,
        }),
      });
    }

    console.log("✅ Examen creado");

    setTitulo("");
    setPreguntas([]);
    obtenerExamenes();
  };

  /* =========================
     ✏️ CARGAR EXAMEN PARA EDITAR
  ========================= */
  const cargarExamen = async (id: number) => {
    console.log("EDITAR EXAMEN:", id);

    const res = await fetch(`http://localhost:3001/examen-completo/${id}`);
    const data = await res.json();

    const agrupado: any = {};

    data.forEach((item: any) => {
      if (!agrupado[item.id_pregunta]) {
        agrupado[item.id_pregunta] = {
          pregunta: item.pregunta,
          respuestas: []
        };
      }

      agrupado[item.id_pregunta].respuestas.push({
        texto: item.respuesta,
        correcta: item.es_correcta === 1
      });
    });

    setPreguntas(Object.values(agrupado));
    setIdEditar(id);
    setEditando(true);

    // 🔥 CARGAR TITULO
    const examen = examenes.find(e => e.id_examen === id);
    if (examen) setTitulo(examen.titulo);
  };

  /* =========================
     💾 ACTUALIZAR EXAMEN
  ========================= */
  const actualizarExamen = async () => {
    const res = await fetch(`http://localhost:3001/examen-completo/${idEditar}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preguntas, titulo }),
    });

    const data = await res.json();
    console.log("ACTUALIZAR:", data);

    setEditando(false);
    setPreguntas([]);
    setTitulo("");
    setIdEditar(null);

    obtenerExamenes();
  };

  /* =========================
     🗑 ELIMINAR EXAMEN
  ========================= */
  const eliminarExamen = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este examen?")) return;

    const res = await fetch(`http://localhost:3001/examenes/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("ELIMINAR:", data);

    obtenerExamenes();
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Exámenes 📝</h2>

      {/* FORM */}
      <div className="card p-3 mb-4">
        <input
          className="form-control mb-3"
          placeholder="Título del examen"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <button className="btn btn-secondary mb-3" onClick={agregarPregunta}>
          + Agregar pregunta
        </button>

        {preguntas.map((p, pIndex) => (
          <div key={pIndex} className="card p-3 mb-3">
            <input
              className="form-control mb-2"
              placeholder="Pregunta"
              value={p.pregunta}
              onChange={(e) => cambiarPregunta(pIndex, e.target.value)}
            />

            {p.respuestas.map((r: any, rIndex: number) => (
              <div key={rIndex} className="d-flex mb-2">
                <input
                  type="radio"
                  className="me-2"
                  checked={r.correcta}
                  onChange={() => marcarCorrecta(pIndex, rIndex)}
                />

                <input
                  className="form-control"
                  placeholder={`Respuesta ${rIndex + 1}`}
                  value={r.texto}
                  onChange={(e) =>
                    cambiarRespuesta(pIndex, rIndex, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ))}

        {editando ? (
          <>
            <button className="btn btn-warning me-2" onClick={actualizarExamen}>
              Guardar cambios
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditando(false);
                setPreguntas([]);
                setTitulo("");
                setIdEditar(null);
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={crearExamen}>
            Crear examen
          </button>
        )}
      </div>

      {/* TABLA */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {examenes.map((ex) => (
            <tr key={ex.id_examen}>
              <td>{ex.id_examen}</td>
              <td>{ex.titulo}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => cargarExamen(ex.id_examen)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarExamen(ex.id_examen)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminExamenes;