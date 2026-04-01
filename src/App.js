//BrowserRouter activa el sistema de rutas (permite tener diferentes "páginas"), Routes: Contenedor de todas las rutas
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import MyInbox from "./pages/MyInbox";
import MyQuestions from "./pages/MyQuestions";
import MyVehicles from "./pages/MyVehicles";
import VehicleDetail from "./pages/VehicleDetail";
import MainContainer from "./components/layout/MainContainer";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route element={
          <ProtectedRoute>
            <MainContainer />
          </ProtectedRoute>
        }>
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/my-inbox" element={<MyInbox />} />
          <Route path="/my-questions" element={<MyQuestions />} />
          <Route path="/my-vehicles" element={<MyVehicles />} />
          <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

