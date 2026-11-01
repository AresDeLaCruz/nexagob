import { useState } from "react";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const enviar = async () => {

    const res = await fetch(
      "http://localhost:3001/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email
        })
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div className="container mt-5">

      <div className="card p-4">

        <h3>Recuperar contraseña</h3>

        <input
          className="form-control mb-3"
          placeholder="Correo"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={enviar}
        >
          Enviar enlace
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;