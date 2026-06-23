import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4">Panel de Administración 👑</h2>

      <div className="row">

        <div className="col-md-4 mb-4">
          <div
            className="card p-4 text-center shadow hover-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin-registrar")}
          >
            <h3>👤</h3>
            <h5 className="mt-3">Registrar empleado</h5>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div
            className="card p-4 text-center shadow hover-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin-empleados")}
          >
            <h3>📊</h3>
            <h5 className="mt-3">Ver empleados</h5>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div
            className="card p-4 text-center shadow hover-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin-examenes")}
          >
            <h3>📝</h3>
            <h5 className="mt-3">Exámenes</h5>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;