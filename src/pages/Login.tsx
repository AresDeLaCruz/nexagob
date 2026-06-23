import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // =========================
  // GOOGLE LOGIN
  // =========================
  const loginGoogle = async (credential: string) => {
    try {
      const response = await fetch(
        "http://localhost:3001/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.id_rol === 1) {
          window.location.href = "/#/admin";
        } else {
          window.location.href = "/#/empleado";
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error con Google Login");
    }
  };

  // =========================
  // LOGIN NORMAL (EMAIL + PASS)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 🔥 SI REQUIERE OTP
        if (data.otpRequired) {
          setUserId(data.userId);
          setStep("otp");
          return;
        }

        // LOGIN NORMAL (fallback)
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.id_rol === 1) {
          navigate("/admin");
        } else {
          navigate("/empleado");
        }
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  // =========================
  // VERIFICAR OTP
  // =========================
  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.id_rol === 1) {
          window.location.href = "/#/admin";
        } else {
          window.location.href = "/#/empleado";
        }
      } else {
        alert(data.message || "Código incorrecto");
      }
    } catch (error) {
      console.error(error);
      alert("Error verificando OTP");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">

            <h3 className="text-center mb-4">
              Iniciar Sesión
            </h3>

            {/* ================= LOGIN NORMAL ================= */}
            {step === "login" && (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Ingresar
                  </button>
                </form>

                <hr />

                <div className="d-flex justify-content-center mt-3">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        loginGoogle(
                          credentialResponse.credential
                        );
                      }
                    }}
                    onError={() => {
                      alert("Error con Google");
                    }}
                  />
                </div>
              </>
            )}

            {/* ================= OTP ================= */}
            {step === "otp" && (
              <div className="text-center">
                <h5 className="mb-3">
                  Verificación en 2 pasos
                </h5>

                <p>
                  Ingresa el código enviado a tu correo
                </p>

                <input
                  className="form-control text-center mb-3"
                  placeholder="6 dígitos"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />

                <button
                  className="btn btn-success w-100"
                  onClick={verifyOtp}
                >
                  Verificar código
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;