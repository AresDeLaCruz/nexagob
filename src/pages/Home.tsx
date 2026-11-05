import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg"; // ajusta la ruta si es necesario
import { API_URL } from "../config"; 
function Home() {
  return (
    <div className="home-page">
      {/* ========== HEADER ========== */}
      <header className="home-header">
        <div className="home-header-content">
          <img src={logo} alt="Logo Comunicaciones" className="home-logo" />
          <div className="home-header-text">
            <h1>COMUNICACIONES</h1>
            <p>SECRETARÍA DE INFRAESTRUCTURA, COMUNICACIONES Y TRANSPORTES</p>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="home-hero">
        <h2>Plataforma de Capacitación</h2>
        <p>
          Fortalece tus competencias y contribuye al servicio público de calidad.
        </p>

        <div className="home-cta">
                <div className="home-cta">
          <Link to="/login" className="btn-home-primary">
            Iniciar sesión
          </Link>
        </div>
        </div>
      </section>

      {/* ========== CARDS ========== */}
      <section className="home-features">
        <div className="home-feature-card">
          <div className="feature-icon">📚</div>
          <h3>Cursos</h3>
          <p>
            Accede a cursos de capacitación diseñados para tu desarrollo profesional en el servicio público.
          </p>
        </div>

        <div className="home-feature-card">
          <div className="feature-icon">📝</div>
          <h3>Evaluaciones</h3>
          <p>
            Realiza exámenes, obtén tu calificación y genera certificados oficiales de capacitación.
          </p>
        </div>

        <div className="home-feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Certificación</h3>
          <p>
            Demuestra tu compromiso institucional y descarga tu certificado al completar el programa.
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="home-footer">
        <p>Gobierno de la Ciudad de México</p>
        <div className="home-footer-links">
          <Link to="/privacidad">Aviso de privacidad</Link>
          <span>•</span>
          <Link to="/terminos">Términos y condiciones</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;