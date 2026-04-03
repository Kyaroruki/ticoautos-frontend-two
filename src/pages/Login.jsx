import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

function Login({ isVisible = true }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
        setMessage("Login exitoso"); //MODIFICAR LOS MENSAJES
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Credenciales incorrectas");
      } else {
        setMessage("Error en el servidor");
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
        setMessage("No tienes cuenta aún. Por favor regístrate con Google.");
      }
    } catch (error) {
      if (error.response?.status === 202) {
        // Usuario nuevo, debe ir a registrarse con cédula
        setMessage("No tienes cuenta aún. Por favor regístrate con Google.");
      } else {
        setMessage("Error al iniciar sesión con Google");
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
            onError={() => setMessage("Error al iniciar sesión con Google")}
          />
        </div>
      )}

      {message && <p>{message}</p>}
    </form>
  );
}

export default Login;