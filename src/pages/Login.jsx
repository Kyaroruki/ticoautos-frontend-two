import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
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

      {message && <p>{message}</p>}
    </form>
  );
}

export default Login;