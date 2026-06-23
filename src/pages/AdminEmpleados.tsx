import { useEffect, useState } from "react";

function AdminEmpleados() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState<number | null>(null);

  const obtenerEmpleados = async () => {
    const res = await fetch("http://localhost:3001/empleados");
    const data = await res.json();
    setEmpleados(data);
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  /* =========================
     🗑 ELIMINAR
  ========================= */
  const eliminarEmpleado = async (id: number) => {
    await fetch(`http://localhost:3001/empleados/${id}`, {
      method: "DELETE",
    });
    obtenerEmpleados();
  };

  /* =========================
     ✏️ CARGAR PARA EDITAR
  ========================= */
  const cargarEmpleado = (emp: any) => {
    setNombre(emp.nombre);
    setEmail(emp.email);
    setIdEditar(emp.id_usuario);
    setEditando(true);
  };

  /* =========================
     💾 ACTUALIZAR
  ========================= */
  const actualizarEmpleado = async () => {
    await fetch(`http://localhost:3001/empleados/${idEditar}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email }),
    });

    setNombre("");
    setEmail("");
    setEditando(false);
    setIdEditar(null);

    obtenerEmpleados();
  };

  return (
    <div>
      <h2 className="mb-4">Lista de Empleados 👥</h2>

      {/* ✏️ FORM EDITAR */}
      {editando && (
        <div className="card p-3 mb-4">
          <h5>Editar empleado</h5>

          <input
            className="form-control mb-2"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-warning me-2" onClick={actualizarEmpleado}>
            Guardar cambios
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditando(false);
              setNombre("");
              setEmail("");
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* 📋 TABLA */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id_usuario}>
              <td>{emp.id_usuario}</td>
              <td>{emp.nombre}</td>
              <td>{emp.email}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => cargarEmpleado(emp)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarEmpleado(emp.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEmpleados;