import { useState } from "react";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("name", name);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.post("/auth/register", formData);

      if (response.status === 201) {
        setMessage("User registered successfully"); 
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Username already exists or missing data");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files[0])}
      />

      <button type="submit">Sign Up</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default Register;