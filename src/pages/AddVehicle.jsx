import React from "react";
import api from "../services/api";
import VehicleForm from "../components/vehicle/VehicleForm";

function AddVehicle() {
  // Función para manejar el registro
  const handleRegister = async (formData) => {
    const response = await api.post("/vehicles", formData);
    if (response.status !== 201) throw new Error("Error registering vehicle");
  };

  return (
    <VehicleForm onSubmit={handleRegister} submitLabel="Register" />
  );
}

export default AddVehicle;
