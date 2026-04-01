import axios from 'axios'; //libreria para hacer peticiones http

//Crea una instancia de axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Interceptor: antes de cada petición agrega el token al header
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; //para usarlo en otros archivos, similar a module.exports que usamos en el backend