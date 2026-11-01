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


  /* 📄 CERTIFICADO CON PLANTILLA */
  const descargarCertificado = () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const img = new Image();

  img.src = "/nexagob/certificado.png";

  img.onload = () => {

    doc.addImage(
      img,
      "PNG",
      0,
      0,
      210,
      297
    );


    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text(
      user.nombre || "Usuario",
      105,
      140,
      {
        align: "center"
      }
    );


    doc.setFontSize(12);

    doc.text(
      new Date().toLocaleDateString(),
      105,
      230,
      {
        align: "center"
      }
    );


    resultadosUnicos.forEach((r: any, index) => {

      doc.text(
        `${r.titulo}: ${r.calificacion}`,
        105,
        160 + (index * 8),
        {
          align: "center"
        }
      );

    });


    doc.save(
      `Certificado_${user.nombre}.pdf`
    );

  };


  img.onerror = () => {
    console.error("No se pudo cargar certificado.png");
  };
};


  return (
    <div className="container">

      <h2 className="mb-4">
        📊 Mis Calificaciones
      </h2>


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

        <button
          className="btn btn-success mt-3"
          onClick={descargarCertificado}
        >
          Descargar certificado 🎓
        </button>

      )}


    </div>
  );
}

export default MisCalificaciones;