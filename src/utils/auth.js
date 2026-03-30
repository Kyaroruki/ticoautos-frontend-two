// Función para obtener el ID del usuario actual a partir del token JWT 
// almacenado en sessionStorage (esto es para identificar al usuario mas adelante
// como comprador o vendedor)

import { jwtDecode } from "jwt-decode";

export function getCurrentUserId() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId || null;
  } catch {
    return null;
  }
}
