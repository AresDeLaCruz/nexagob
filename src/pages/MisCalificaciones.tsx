import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { API_URL } from "../config"; 
function MisCalificaciones() {
  const [misResultados, setMisResultados] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const cargarResultados = () => {
    fetch(`${API_URL}/resultados/${user.id_usuario}`)
      .then((res) => res.json())
      .then((data) => setMisResultados(data));
  };

  useEffect(() => {
    cargarResultados();
  }, []);

  /* 🔥 FILTRAR MEJOR INTENTO DE CADA EXAMEN */
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

  /* 🏆 VALIDAR SI PUEDE DESCARGAR CERTIFICADO */
  const aprobado =
    resultadosUnicos.length >= 3 &&
    resultadosUnicos.every((r: any) => Number(r.calificacion) >= 8);

  /* 📄 CERTIFICADO BONITO */
  const descargarCertificado = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ========== FONDO ==========
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Borde exterior
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Borde interior
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // ========== HEADER ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("GOBIERNO DE LA CIUDAD DE MÉXICO", pageWidth / 2, 25, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text("Secretaría de Administración y Finanzas", pageWidth / 2, 32, {
      align: "center",
    });

    // Línea decorativa
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.8);
    doc.line(40, 38, pageWidth - 40, 38);

    // ========== TÍTULO ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42);
    doc.text("CERTIFICADO DE CAPACITACIÓN", pageWidth / 2, 55, {
      align: "center",
    });

    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105);
    doc.text("Se otorga el presente reconocimiento a:", pageWidth / 2, 68, {
      align: "center",
    });

    // ========== NOMBRE DEL EMPLEADO ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(30, 64, 175);
    doc.text(user.nombre?.toUpperCase() || "EMPLEADO", pageWidth / 2, 85, {
      align: "center",
    });

    // Línea debajo del nombre
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.6);
    const nombreWidth = doc.getTextWidth(
      user.nombre?.toUpperCase() || "EMPLEADO"
    );
    doc.line(
      (pageWidth - nombreWidth) / 2 - 5,
      88,
      (pageWidth + nombreWidth) / 2 + 5,
      88
    );

    // ========== TEXTO PRINCIPAL ==========
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(
      "Por haber completado satisfactoriamente el programa de capacitación",
      pageWidth / 2,
      102,
      { align: "center" }
    );
    doc.text(
      "en materia de Seguridad de la Información, demostrando un alto nivel",
      pageWidth / 2,
      109,
      { align: "center" }
    );
    doc.text(
      "de conocimiento y compromiso institucional.",
      pageWidth / 2,
      116,
      { align: "center" }
    );

    // ========== RESULTADOS ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175);
    doc.text("Resultados obtenidos:", pageWidth / 2, 130, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    let yPos = 138;
    resultadosUnicos.forEach((r: any) => {
      const texto = `${r.titulo}:  ${Number(r.calificacion).toFixed(1)} / 10`;
      doc.text(texto, pageWidth / 2, yPos, { align: "center" });
      yPos += 6;
    });

    // ========== FECHA ==========
    const fecha = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text(`Ciudad de México, a ${fecha}`, pageWidth / 2, 175, {
      align: "center",
    });

    // ========== FIRMAS ==========
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.4);
    doc.line(50, 195, 110, 195);
    doc.line(pageWidth - 110, 195, pageWidth - 50, 195);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Firma del Capacitador", 80, 202, { align: "center" });
    doc.text("Sello Institucional", pageWidth - 80, 202, { align: "center" });

    // ========== FOOTER ==========
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "NexaGob • Plataforma de Capacitación Oficial • Documento generado electrónicamente",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );

    // Guardar PDF
    doc.save(
      `Certificado_${user.nombre?.replace(/\s+/g, "_") || "Empleado"}.pdf`
    );
  };

  return (
    <div className="container">
      <h2 className="mb-4">📊 Mis Calificaciones</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Examen</th>
            <th>Calificación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {resultadosUnicos.map((r: any, i) => (
            <tr key={i}>
              <td>{r.titulo}</td>
              <td>
                <strong>{Number(r.calificacion).toFixed(1)}</strong>
              </td>
              <td>
                {Number(r.calificacion) >= 8 ? (
                  <span className="badge bg-success">Aprobado</span>
                ) : (
                  <span className="badge bg-danger">No aprobado</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🎓 CERTIFICADO */}
      {aprobado ? (
        <div className="mt-5 p-4 border rounded bg-light text-center">
          <h4 className="text-success mb-3">¡Felicidades! 🎉</h4>
          <p className="mb-3">
            Has aprobado todos los exámenes con calificación mínima de 8.
            <br />
            Ya puedes descargar tu certificado oficial.
          </p>
          <button
            className="btn btn-success btn-lg px-5"
            onClick={descargarCertificado}
          >
            🎓 Descargar Certificado
          </button>
        </div>
      ) : (
        <div className="mt-4 alert alert-warning">
          <strong>Para obtener el certificado</strong> debes aprobar los 3
          exámenes con una calificación mínima de <strong>8.0</strong>.
        </div>
      )}
    </div>
  );
}

export default MisCalificaciones;