import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

function Login({ isVisible = true, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        if (token) {
          sessionStorage.setItem("token", token);
          navigate("/"); // Redirige a la principal
        }
        showToast("Login exitoso", "success");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast("Credenciales incorrectas", "error");
      } else if (error.response?.status === 403) {
        // NUEVO: si la cuenta existe pero sigue pendiente, avisamos que primero debe activar el correo.
        showToast("Debes verificar tu correo antes de ingresar", "error");
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
  );
}

export default Login;