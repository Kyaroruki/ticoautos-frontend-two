import axios from 'axios';

// Crea una instancia de Axios con la configuración base para GraphQL
const graphqlApi = axios.create({
  baseURL: 'http://localhost:3000'
});

// para incluir el token en cada petición automáticamente sin tener que agregarlo manualmente en cada llamada
graphqlApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default graphqlApi;