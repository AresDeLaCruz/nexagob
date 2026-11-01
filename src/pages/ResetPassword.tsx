import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const cambiarPassword = async () => {

    const res = await fetch(
      "http://localhost:3001/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          password
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      alert("Contraseña actualizada correctamente");

      navigate("/login");

    } else {

      alert(
        data.message ||
        "Error al actualizar contraseña"
      );

    }

  };

  return (
    <div className="container mt-5">

      <div className="card p-4">

        <h3>Nueva contraseña</h3>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="btn btn-success"
          onClick={cambiarPassword}
        >
          Guardar contraseña
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;