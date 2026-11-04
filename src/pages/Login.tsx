import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.jpg"; // o "../assets/logo.jpg" según donde esté

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // GOOGLE LOGIN
  // =========================
  const loginGoogle = async (credential: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

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
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN NORMAL
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.otpRequired) {
          setUserId(data.userId);
          setStep("otp");
          return;
        }

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
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFICAR OTP
  // =========================
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ========== HEADER INSTITUCIONAL ========== */}
      <div className="login-header">
        <div className="login-header-content">
          <img src={logo} alt="Logo" className="login-logo" />
          <div className="login-header-text">
            <h1>COMUNICACIONES</h1>
            <p>SECRETARÍA DE INFRAESTRUCTURA, COMUNICACIONES Y TRANSPORTES</p>
          </div>
        </div>
      </div>

      {/* ========== FORMULARIO ========== */}
      <div className="login-body">
        <div className="login-card">
          {step === "login" ? (
            <>
              <form onSubmit={handleSubmit}>
                {/* Usuario / Correo */}
                <div className="login-input-group">
                  <div className="login-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Usuario o correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Contraseña */}
                <div className="login-input-group">
                  <div className="login-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
              </form>

              <div className="login-forgot">
                <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>

              {/* Google Login (opcional, se puede ocultar si no lo quieren en móvil) */}
              <div className="login-google">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      loginGoogle(credentialResponse.credential);
                    }
                  }}
                  onError={() => alert("Error con Google")}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>
            </>
          ) : (
            /* ========== OTP ========== */
            <div className="login-otp">
              <h5>Verificación en 2 pasos</h5>
              <p>Ingresa el código de 6 dígitos enviado a tu correo</p>

              <div className="login-input-group">
                <input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center"
                  style={{ letterSpacing: "4px", fontSize: "1.3rem" }}
                />
              </div>

              <button className="login-btn" onClick={verifyOtp} disabled={loading}>
                {loading ? "Verificando..." : "Verificar código"}
              </button>

              <button
                className="btn btn-link mt-3"
                onClick={() => setStep("login")}
                style={{ color: "#6a0f2b" }}
              >
                ← Volver
              </button>
            </div>
          )}
        </div>

        <div className="login-footer-links">
          <Link to="/privacidad">Aviso de privacidad</Link>
          <span>•</span>
          <Link to="/terminos">Términos</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;