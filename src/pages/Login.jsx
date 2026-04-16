import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

function Login({ isVisible = true, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estado para el flujo 2FA
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });

      if (response.data.twoFARequired) {
        // El backend envió un SMS con el código, mostramos la pantalla de 2FA
        setTwoFARequired(true);
        showToast("Se envió un código de verificación a tu teléfono", "info");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("Credenciales incorrectas", "error");
      } else if (error.response?.status === 403) {
        // NUEVO: si la cuenta existe pero sigue pendiente, avisamos que primero debe activar el correo.
        showToast("Debes verificar tu correo antes de ingresar", "error");
      } else {
        showToast("Error en el servidor", "error");
      }
    }
  };

  // PASO 2: Verificación del código 2FA
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/verify-2fa", { username, code: twoFACode });
      const token = response.data.token;
      if (token) {
        sessionStorage.setItem("token", token);
        navigate("/");
        showToast("Login exitoso", "success");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("Código incorrecto o expirado", "error");
      } else {
        showToast("Error en el servidor", "error");
      }
    }
  };

  // Maneja el login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential
      });

      if (response.status === 200) {
        // Usuario ya registrado, inicia sesión directamente
        sessionStorage.setItem("token", response.data.token);
        navigate("/");
      } else if (response.status === 202) {
        // Usuario nuevo, debe ir a registrarse con cédula
        showToast("No tienes cuenta aun. Por favor registrate con Google.", "info");
      }
    } catch (error) {
      if (error.response?.status === 202) {
        // Usuario nuevo, debe ir a registrarse con cédula
        showToast("No tienes cuenta aun. Por favor registrate con Google.", "info");
      } else if (error.response?.status === 403) {
        // NUEVO: tambien bloqueamos el login con Google si la cuenta sigue pendiente de verificacion.
        showToast("Debes verificar tu correo antes de ingresar", "error");
      } else {
        showToast("Error al iniciar sesion con Google", "error");
      }
    }
  };

  return (
    <>
      {/* Pantalla de verificación 2FA: aparece después de que el backend envió el SMS */}
      {twoFARequired ? (
        <form onSubmit={handle2FASubmit}>
          <h1>Verificación 2FA</h1>
          <p>Ingresa el código de 6 dígitos que enviamos a tu teléfono.</p>
          <input
            type="text"
            placeholder="Código de verificación"
            value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit">Verificar</button>
        </form>
      ) : (
        /* Pantalla normal de login */
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>

          {/* Botón de Google para login */}
          {isVisible && (
            <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => showToast("Error al iniciar sesion con Google", "error")}
              />
            </div>
          )}
        </form>
      )}
    </>
  );
}

export default Login;