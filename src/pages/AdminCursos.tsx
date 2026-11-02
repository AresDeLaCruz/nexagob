import { useEffect, useState } from "react";

function AdminCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<number | null>(null);
  const [temas, setTemas] = useState<any[]>([]);
  const [tituloTema, setTituloTema] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [orden, setOrden] = useState(1);

  const obtenerCursos = async () => {
    const res = await fetch("http://localhost:3001/cursos");
    const data = await res.json();
    setCursos(data);
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  const crearCurso = async () => {
    if (!titulo.trim()) return alert("Escribe un título");

    await fetch("http://localhost:3001/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion }),
    });

    setTitulo("");
    setDescripcion("");
    obtenerCursos();
  };

  const eliminarCurso = async (id: number) => {
    if (!confirm("¿Eliminar este curso y todos sus temas?")) return;
    await fetch(`http://localhost:3001/cursos/${id}`, { method: "DELETE" });
    obtenerCursos();
    setCursoSeleccionado(null);
    setTemas([]);
  };

  const cargarTemas = async (id_curso: number) => {
    setCursoSeleccionado(id_curso);
    const res = await fetch(`http://localhost:3001/cursos/${id_curso}/temas`);
    const data = await res.json();
    setTemas(data);
  };

  const crearTema = async () => {
    if (!cursoSeleccionado || !tituloTema || !archivo) {
      return alert("Completa título y selecciona un PDF");
    }

    const formData = new FormData();
    formData.append("id_curso", cursoSeleccionado.toString());
    formData.append("titulo", tituloTema);
    formData.append("orden", orden.toString());
    formData.append("pdf", archivo);

    await fetch("http://localhost:3001/temas", {
      method: "POST",
      body: formData,
    });

    setTituloTema("");
    setArchivo(null);
    setOrden(1);
    cargarTemas(cursoSeleccionado);
  };

  const eliminarTema = async (id_tema: number) => {
    if (!confirm("¿Eliminar este tema?")) return;
    await fetch(`http://localhost:3001/temas/${id_tema}`, { method: "DELETE" });
    if (cursoSeleccionado) cargarTemas(cursoSeleccionado);
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Cursos 📚</h2>

      {/* CREAR CURSO */}
      <div className="card p-4 mb-4">
        <h5>Crear nuevo curso</h5>
        <input
          className="form-control mb-2"
          placeholder="Título del curso"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button className="btn btn-success" onClick={crearCurso}>
          Crear curso
        </button>
      </div>

      {/* LISTA DE CURSOS */}
      <div className="row">
        <div className="col-md-5">
          <h5>Cursos existentes</h5>
          {cursos.map((c) => (
            <div key={c.id_curso} className="card p-3 mb-2">
              <strong>{c.titulo}</strong>
              <p className="mb-2 text-muted small">{c.descripcion}</p>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => cargarTemas(c.id_curso)}
              >
                Gestionar temas
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarCurso(c.id_curso)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* GESTIÓN DE TEMAS */}
        <div className="col-md-7">
          {cursoSeleccionado && (
            <div className="card p-4">
              <h5>Temas del curso</h5>

              <div className="mb-3">
                <input
                  className="form-control mb-2"
                  placeholder="Título del tema (ej: Tema 1 - Introducción)"
                  value={tituloTema}
                  onChange={(e) => setTituloTema(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Orden (1 o 2)"
                  value={orden}
                  onChange={(e) => setOrden(Number(e.target.value))}
                  min={1}
                  max={2}
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="application/pdf"
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                />
                <button className="btn btn-success" onClick={crearTema}>
                  Subir tema (PDF)
                </button>
              </div>

              <hr />

              {temas.length === 0 && <p className="text-muted">Aún no hay temas</p>}

              {temas.map((t) => (
                <div key={t.id_tema} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded">
                  <div>
                    <strong>{t.titulo}</strong>
                    {t.archivo_pdf && (
                      <div>
                        <a
                          href={`http://localhost:3001/uploads/${t.archivo_pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="small"
                        >
                          Ver PDF
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarTema(t.id_tema)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCursos;