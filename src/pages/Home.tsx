function Home() {
  return (
    <div className="text-center">
      <h1 className="mb-4">Bienvenido a NexaGob</h1>
      <p className="lead">
        Plataforma de capacitación para empleados.
      </p>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Cursos</h5>
              <p className="card-text">
                Accede a cursos de capacitación diseñados para tu desarrollo profesional.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Evaluaciones</h5>
              <p className="card-text">
                Realiza exámenes y obtén certificación interna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
