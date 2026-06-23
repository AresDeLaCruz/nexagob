import { Link, useNavigate } from "react-router-dom";

function Navbar({ onDescargarCertificado }: any) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ backgroundColor: "#6a0f2b", padding: "12px 30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* IZQUIERDA */}
        <div style={{ display: "flex", alignItems: "center", color: "white" }}>
          
          {/* Avatar */}
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #ff7b7b, #ff3d7f)",
              marginRight: "12px"
            }}
          />

          <strong style={{ marginRight: "20px" }}>
            {user?.nombre || "Invitado"}
          </strong>

          <Link to="/" style={linkStyle}>
            INICIO
          </Link>

          {user?.id_rol === 2 && (
            <>
              
            </>
          )}
        </div>

        {/* DERECHA */}
        <button
          style={btnStyle}
          onClick={() => {
            if (user) {
              cerrarSesion();
            } else {
              navigate("/login");
            }
          }}
        >
          {user ? "Cerrar sesión" : "Iniciar sesión"}
        </button>

      </div>
    </nav>
  );
}

const linkStyle = {
  marginRight: "20px",
  cursor: "pointer",
  fontWeight: 500,
  color: "white",
  textDecoration: "none"
};

const btnStyle = {
  backgroundColor: "#b55b4f",
  color: "white",
  border: "none",
  borderRadius: "30px",
  padding: "10px 20px",
  cursor: "pointer"
};

export default Navbar;