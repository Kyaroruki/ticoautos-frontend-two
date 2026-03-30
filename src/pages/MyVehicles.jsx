import React, { useEffect, useState } from 'react';
import VehicleManageCard from '../components/vehicle/VehicleManageCard';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import QuestionModal from "../components/chat/QuestionModal";

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  // Questions modal
  const [isOpenQuestions, setIsOpenQuestions] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const openQuestions = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpenQuestions(true);
  };

  const closeQuestions = () => {
    setIsOpenQuestions(false);
    setSelectedVehicle(null);
  };

  useEffect(() => {
    const fetchUserVehicles = async () => {
      try {
        const res = await api.get('/vehicles/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(res.data);
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserVehicles();
  }, [token]);

  if (loading);
    if (!vehicles.length) return (
      <div className="page-wrapper">
        <div className="simple-container">
          <h1 style={{ color: '#fff', margin: '32px 0 16px 0', textAlign: 'center' }}>My Vehicles</h1>
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '32px' }}>No vehicles found.</div>
        </div>
      </div>
    );

    return (
      <div className="page-wrapper">
        <div className="simple-container">
          <h1 style={{ color: '#fff', margin: '32px 0 16px 0', textAlign: 'center' }}>My Vehicles</h1>
          <div className="simple-cards">
            {vehicles.map(vehicle => (
              <VehicleManageCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                onDelete={async () => {
                  if (window.confirm('Are you sure you want to delete this vehicle?')) {
                    await api.delete(`/vehicles/${vehicle._id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setVehicles(vehicles.filter(v => v._id !== vehicle._id));
                  }
                }}
                onMarkSold={async () => {
                  await api.patch(`/vehicles/${vehicle._id}/sold`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setVehicles(vehicles.map(v => v._id === vehicle._id ? { ...v, status: 'sold' } : v));
                  alert('Vehicle marked as sold');
                }}
                question={openQuestions}
              />
            ))}
          </div>
        </div>
        {isOpenQuestions && selectedVehicle && (
          <QuestionModal vehicle={selectedVehicle} onClose={closeQuestions} /> // Modal de preguntas
        )}
      </div>
    );
};

export default MyVehicles;