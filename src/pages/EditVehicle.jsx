import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import VehicleForm from "../components/vehicle/VehicleForm";
import VehicleManageCard from "../components/vehicle/VehicleManageCard";


function EditVehicle() {
  const { id } = useParams(); // obtiene el id de la URL
  const [vehicle, setVehicle] = useState(null);
  const [showEditForm, setShowEditForm] = useState(true);

  useEffect(() => {
    // Cargar datos del vehículo
    api.get(`/vehicles/${id}`)
      .then(res => setVehicle(res.data))
      .catch(() => setVehicle(null));
  }, [id]);

  // Función para manejar la edición
  const handleEdit = async (formData) => {
    const response = await api.put(`/vehicles/${id}`, formData);
    if (response.status !== 200) throw new Error("Error editing vehicle");
    setShowEditForm(false);
    // Recargar datos
    api.get(`/vehicles/${id}`)
      .then(res => setVehicle(res.data))
      .catch(() => setVehicle(null));
  };

  // Eliminar vehículo
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await api.delete(`/vehicles/${id}`);
      window.location.href = '/'; 
    }
  };

  // Cambiar estado a vendido
  const handleMarkAsSold = async () => {
    await api.patch(`/vehicles/${id}/sold`);
    setVehicle({ ...vehicle, status: 'sold' });
    alert('Vehicle marked as sold');
  };

  if (!vehicle) return <p>Loading vehicle data...</p>;

  return (
    <div>
      <VehicleForm initialData={vehicle} onSubmit={handleEdit} submitLabel="Save changes" />
    </div>
  );
}

export default EditVehicle;