import { useState } from "react";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [identify_number, setIdentifyNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIdentifyNumberChange = (e) => {
    setIdentifyNumber(e.target.value);
    setName("");
    setLastname("");
    setIsVerified(false);
    setMessage("");
  };

  const handleVerifyIdentity = async () => {
    if (!identify_number.trim()) {
      setMessage("Debe ingresar una cédula para consultar el padrón");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await api.get(`/auth/identity/${identify_number}`);

      setName(response.data.name);
      setLastname(response.data.lastname);
      setIsVerified(true);
      setMessage("Cédula validada correctamente");
    } catch (error) {
      setName("");
      setLastname("");
      setIsVerified(false);
      setMessage(error.response?.data?.message || "No fue posible consultar el padrón");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage("Debe validar la cédula antes de registrarse");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("identify_number", identify_number);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("phone_number", phoneNumber);
      
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.post("/auth/register", formData);

      if (response.status === 201) {
        setUsername("");
        setPassword("");
        setEmail("");
        setPhoneNumber("");
        setName("");
        setLastname("");
        setIdentifyNumber("");
        setProfileImage(null);
        setIsVerified(false);
        setMessage(response.data.message || "Usuario registrado correctamente");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error en el servidor");
    } finally {
      setIsSubmitting(false);
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
        placeholder="Identify Number"
        value={identify_number}
        onChange={handleIdentifyNumberChange}
      />

      <button type="button" onClick={handleVerifyIdentity} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : "Verify ID"}
      </button>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        readOnly
      />

      <input 
        type="text"
        placeholder="Lastname"
        value={lastname}
        readOnly
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
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

      <button type="submit" disabled={!isVerified || isSubmitting}>
        {isSubmitting ? "Registering..." : "Sign Up"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default Register;