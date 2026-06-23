import { useEffect, useState } from "react";
import jsPDF from "jspdf";

function MisCalificaciones() {
  const [misResultados, setMisResultados] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const cargarResultados = () => {
    fetch(`http://localhost:3001/resultados/${user.id_usuario}`)
      .then(res => res.json())
      .then(data => setMisResultados(data));
  };

  useEffect(() => {
    cargarResultados();
  }, []);

  /* 🔥 FILTRAR MEJOR INTENTO */
  const resultadosUnicos = Object.values(
    misResultados.reduce((acc: any, curr: any) => {
      if (
        !acc[curr.id_examen] ||
        Number(curr.calificacion) > Number(acc[curr.id_examen].calificacion)
      ) {
        acc[curr.id_examen] = curr;
      }
      return acc;
    }, {})
  );

  /* 🏆 VALIDAR CERTIFICADO */
  const aprobado =
    resultadosUnicos.length >= 3 &&
    resultadosUnicos.every(r => Number(r.calificacion) >= 8);

  /* 📄 PDF */
  const descargarCertificado = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CERTIFICADO", 70, 30);

    doc.setFontSize(14);
    doc.text(`Otorgado a: ${user.nombre}`, 20, 60);
    doc.text("Por aprobar satisfactoriamente los exámenes", 20, 80);

    resultadosUnicos.forEach((r: any, i) => {
      doc.text(`${r.titulo}: ${r.calificacion}`, 20, 110 + i * 10);
    });

    doc.save("certificado.pdf");
  };

  return (
    <div className="container">
      <h2 className="mb-4">📊 Mis Calificaciones</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Examen</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {resultadosUnicos.map((r: any, i) => (
            <tr key={i}>
              <td>{r.titulo}</td>
              <td>{r.calificacion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🎓 CERTIFICADO */}
      {aprobado && (
        <button className="btn btn-success mt-3" onClick={descargarCertificado}>
          Descargar certificado 🎓
        </button>
      )}
    </div>
  );
}

export default MisCalificaciones;