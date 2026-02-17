import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger ">
      <div className="container">
        <Link className="navbar-brand" to="/">
          NexaGob
        </Link>

        <div>
          <Link className="btn btn-light me-2" to="/login">
            Iniciar Sesión
          </Link>
          <Link className="btn btn-outline-light" to="/register">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
