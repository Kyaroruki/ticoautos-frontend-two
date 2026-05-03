import { useState } from "react";
import api, { padronApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Register({ isVisible = true, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [identify_number, setIdentifyNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el modal de Google
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleCedula, setGoogleCedula] = useState("");
  const [googleUsername, setGoogleUsername] = useState("");
  const [googlePhone, setGooglePhone] = useState("");
  const [googleMessage, setGoogleMessage] = useState("");
  const [googleCedulaVerified, setGoogleCedulaVerified] = useState(false);
  const [googleCedulaName, setGoogleCedulaName] = useState("");
  const [googleCedulaLastname, setGoogleCedulaLastname] = useState("");
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");

  const navigate = useNavigate();

  const handleIdentifyNumberChange = (e) => {
    setIdentifyNumber(e.target.value);
    setName("");
    setLastname("");
    setIsVerified(false);
  };

  const handleVerifyIdentity = async () => {
    if (!identify_number.trim()) {
      showToast("Debe ingresar una cedula para consultar el padron", "error");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await padronApi.get(`/identity/${identify_number}`);

      setName(response.data.name);
      setLastname(response.data.lastname);
      setIsVerified(true);
      showToast("Cedula validada correctamente", "success");
    } catch (error) {
      setName("");
      setLastname("");
      setIsVerified(false);
      if (error.response?.status === 404) {
        showToast("La cedula no aparece en el padron o eres menor de edad", "error");
      } else {
        showToast("No se pudo consultar el padron", "error");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      showToast("Debes validar la cedula antes de registrarte", "error");
      return;
    }

    setIsSubmitting(true);

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
        // NUEVO: ahora al registrarse no entra de una vez; primero debe revisar el correo y activar la cuenta.
        showToast("Registro completado. Revisa tu correo para activar la cuenta", "success");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        showToast("Ya existe un usuario registrado con esos datos", "error");
      } else if (error.response?.status === 404) {
        showToast("La cedula no aparece en el padron", "error");
      } else if (error.response?.status === 400) {
        showToast("Completa correctamente los datos del registro", "error");
      } else {
        showToast("Error en el servidor", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Maneja el clic en "Sign up with Google"
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential
      });
      if (response.status === 200) {
        sessionStorage.setItem("token", response.data.token);
        navigate("/");
      } else if (response.status === 202) {
        // Usuario nuevo, muestra el modal para pedir la cédula
        const decoded = jwtDecode(credentialResponse.credential);
        setGoogleCredential(credentialResponse.credential);
        setGoogleEmail(decoded.email || '');
        setShowGoogleModal(true);
        showToast("Completa los datos faltantes para terminar el registro con Google", "info");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        showToast("Ese correo de Google ya esta registrado", "error");
      } else if (error.response?.status === 403) {
        // NUEVO: si la cuenta de Google existe pero sigue pendiente, avisamos que falta activar el correo.
        showToast("Debes verificar tu correo antes de ingresar", "error");
      } else {
        showToast("Error al registrarse con Google", "error");
      }
    }
  };

  // Verifica la cédula dentro del modal de Google
  const handleGoogleVerifyCedula = async () => {
    if (!googleCedula.trim()) { setGoogleMessage("Enter an ID"); return; }
    setGoogleMessage("");
    try {
      const response = await padronApi.get(`/identity/${googleCedula}`);
      setGoogleCedulaName(response.data.name);
      setGoogleCedulaLastname(response.data.lastname);
      setGoogleCedulaVerified(true);
      setGoogleMessage("ID validated successfully");
    } catch {
      setGoogleCedulaVerified(false);
      setGoogleMessage("ID not found in the registry");
    }
  };

  // Completa el registro con Google
  const handleGoogleRegister = async () => {
    if (!googleCedulaVerified || !googleUsername.trim() || !googlePhone.trim() || !googleEmail.trim()) {
      setGoogleMessage("Complete all fields and verify the ID");
      return;
    }
    setIsGoogleSubmitting(true);
    try {
      const response = await api.post("/auth/google/register", {
        credential: googleCredential,
        identify_number: googleCedula,
        username: googleUsername,
        phone_number: googlePhone,
        email: googleEmail
      });
      if (response.status === 201) {
        setShowGoogleModal(false);
        setGoogleCedula("");
        setGoogleUsername("");
        setGooglePhone("");
        setGoogleMessage("");
        setGoogleCedulaVerified(false);
        // NUEVO: igual que en el registro normal, aqui tambien queda pendiente hasta confirmar el email.
        showToast("Registro con Google completado. Revisa tu correo para activar la cuenta", "success");
      }
    } catch (error) {
      if (error.response?.status === 409) setGoogleMessage(error.response.data?.message || "User or ID already registered");
      else if (error.response?.status === 404) setGoogleMessage(error.response.data?.message || "ID not found in the registry");
      else setGoogleMessage(error.response?.data?.message || "Error registering with Google");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      
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
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

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

      {/* Botón de Google para registro */}
      {isVisible && (
        <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showToast("Error al registrarse con Google", "error")}
            text="signup_with"
          />
        </div>
      )}
    </form>

    {/* Modal para pedir cédula cuando el usuario se registra con Google */}
    {showGoogleModal && (
      <div className="google-modal-overlay">
        <div className="google-modal">
          <h2>Complete your registration</h2>

          <input type="text" placeholder="Identify Number" value={googleCedula}
            onChange={(e) => { setGoogleCedula(e.target.value); setGoogleCedulaVerified(false); }} />

          <button type="button" onClick={handleGoogleVerifyCedula}>
            Verify ID
          </button>

          {googleCedulaVerified && (
            <>
              <input type="text" value={googleCedulaName} readOnly placeholder="Name" className="input-readonly" />
              <input type="text" value={googleCedulaLastname} readOnly placeholder="Lastname" className="input-readonly" />
            </>
          )}

          <input type="text" placeholder="Username" value={googleUsername}
            onChange={(e) => setGoogleUsername(e.target.value)} />

          <input type="text" placeholder="Phone Number" value={googlePhone}
            onChange={(e) => setGooglePhone(e.target.value)} />

          <input type="email" placeholder="Email" value={googleEmail || ''}
            readOnly className="input-readonly" />

          {googleMessage && (
            <p className={googleCedulaVerified && !googleMessage.toLowerCase().includes('complete') ? 'msg-success' : 'msg-error'}>{googleMessage}</p>
          )}

          <button type="button" onClick={handleGoogleRegister} disabled={!googleCedulaVerified || isGoogleSubmitting}>
            {isGoogleSubmitting ? "Registering..." : "Complete Registration"}
          </button>

          <button type="button" className="btn-cancel" onClick={() => setShowGoogleModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default Register;