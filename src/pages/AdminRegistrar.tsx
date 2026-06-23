import { useState } from "react";

function AdminRegistrar() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const validarPassword = (password: string) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    if (!regex.test(password)) {
      return "Mínimo 8 caracteres y una mayúscula";
    }
    return "";
  };
  const validarEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

  const crearEmpleado = async () => {
    const error = validarPassword(password);
    if (!validarEmail(email)) {
  alert("Ingresa un correo válido");
  return;
}

    if (error) {
      setErrorPassword(error);
      return;
    }

    setErrorPassword("");

    await fetch("http://localhost:3001/empleados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    alert("Empleado creado ✅");

    setNombre("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h2>Registrar empleado 👤</h2>

      <div className="card p-4">
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="correo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className={`form-control mb-2 ${errorPassword ? "is-invalid" : ""}`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorPassword && (
          <div className="text-danger">{errorPassword}</div>
        )}

        <button className="btn btn-success" onClick={crearEmpleado}>
          Crear empleado
        </button>
      </div>
    </div>
  );
}

export default AdminRegistrar;