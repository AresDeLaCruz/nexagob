function Home() {
  return (
    <div style={{ backgroundColor: "#e8dcc7", minHeight: "100vh" }}>
      
      {/* CONTENIDO */}
      <div className="container text-center py-5">

        {/* TÍTULO */}
        <h1 
          style={{ 
            fontSize: "70px", 
            color: "#3b5e3b", 
            fontFamily: "serif",
            marginBottom: "40px"
          }}
        >
          Bienvenido
        </h1>

        {/* TARJETAS */}
        <div 
          className="mx-auto p-4"
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            maxWidth: "800px"
          }}
        >
          <div className="row">
            
            {/* CURSOS */}
            <div className="col-md-6 mb-3">
              <div 
                className="card shadow-sm"
                style={{ borderRadius: "10px" }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">Cursos</h5>
                  <p className="card-text">
                    Accede a cursos de capacitación diseñados para tu desarrollo profesional.
                  </p>
                </div>
              </div>
            </div>

            {/* EVALUACIONES */}
            <div className="col-md-6 mb-3">
              <div 
                className="card shadow-sm"
                style={{ borderRadius: "10px" }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">Evaluaciones</h5>
                  <p className="card-text">
                    Realiza exámenes y obtén certificación interna.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER TEXTO */}
        <div className="mt-5" style={{ color: "#3b5e3b" }}>
          <span className="me-3">CDMX</span>
          <span className="me-3">COYOACAN</span>
          <span>📍</span>
        </div>

      </div>
    </div>
  );
}

export default Home;