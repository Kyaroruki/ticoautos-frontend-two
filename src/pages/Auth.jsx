import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import '../styles/Auth.css';

function Auth() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className={`container ${isActive ? "active" : ""}`}>

        <div className="form-container sign-up">
          <Register isVisible={isActive} /> {/* Aquí se muestra el formulario de registro */}
        </div>

        <div className="form-container sign-in">
          <Login isVisible={!isActive} /> {/* Aquí se muestra el formulario de inicio de sesión */}
        </div>

        <div className="toggle-container"> {/* Contenedor para los paneles de bienvenida */}
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome to TicoAutos</h1>
              <p>Already have an account?</p>
              <button
                type="button"
                className="hidden"
                onClick={() => setIsActive(false)} // Cambia a la vista de inicio de sesión
              >
                Sign In
              </button>
            </div>

            <div className="toggle-panel toggle-right"> {/* Panel derecho con mensaje de bienvenida para nuevos usuarios */}
              <h1>Welcome back</h1>
              <p>Don't have an account?</p>
              <button
                type="button"
                className="hidden"
                onClick={() => setIsActive(true)} // Cambia a la vista de registro
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;