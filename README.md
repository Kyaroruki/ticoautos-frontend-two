# TicoAutos Frontend

TicoAutos permite explorar los vehículos, filtrar resultados, registrarse, iniciar sesión y gestionar preguntas entre compradores y vendedores.

## Stack

- React
- React Router DOM
- Axios
- Bootstrap y React Bootstrap
- React Icons

## Requisitos

- Node.js 18+
- npm
- Backend/api de TicoAutos 

## Instalación y ejecución

```bash
npm install
npm start
```

El frontend consume la API en:
```
http://localhost:3000/api
``````
```
## Funcionalidades

- Registro e inicio de sesión
- Persistencia del token en `sessionStorage`
- Protección de rutas privadas
- Listado de vehículos con filtros y paginación
- Vista de detalle por vehículo
- Creación, edición y eliminación de vehículos propios
- Marcado de vehículos como vendidos
- Preguntas y respuestas entre compradores y vendedores
- Copia de enlace directo de vehículo

## Autenticación

- El token se guarda en `sessionStorage`
- Las rutas privadas usan `ProtectedRoute`
