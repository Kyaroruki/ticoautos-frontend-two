import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import '../styles/vehicle.css';

function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then(res => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch(() => {
        setVehicle(null);
        setLoading(false);
      });
  }, [id]);

    useEffect(() => {
      document.body.style.background = '#161515';
      return () => {
        document.body.style.background = '';
      };
    }, []);

    if (!vehicle) {
      return <p style={{ color: '#fff', background: '#161515', padding: '32px', borderRadius: '18px', textAlign: 'center', margin: '40px auto', maxWidth: 600 }}>Vehicle not found.</p>;
    }

  return (
    <div style={{ background: ' #000000', borderRadius: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', margin: '40px auto', maxWidth: 1200, padding: '48px', color: '#fff', border: '1px solid #292929', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '48px' }}>
      <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={vehicle.image ? `http://localhost:3000/uploads/${vehicle.image}` : '/default-car.png'} alt="auto" style={{ width: '100%', maxWidth: 400, borderRadius: 14, marginBottom: 24 }} />
        <button
          style={{ marginTop: 24, padding: '12px 32px', borderRadius: 8, background: '#222', color: '#fff', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
          onClick={() => window.location.href = '/'}
        >Back to Home</button>
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: 8 }}>{vehicle.brand} {vehicle.model}</h2>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Price:</strong> ${vehicle.price}</p>
        <p><strong>Status:</strong> {vehicle.status}</p>
        <p><strong>Description:</strong> {vehicle.description}</p>
        <hr style={{ margin: '24px 0', borderColor: '#444', width: '100%' }} />
        <p><strong>Owner:</strong> {vehicle.owner?.name || 'Unknown'}</p>
        <p><strong>Published:</strong> {new Date(vehicle.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default VehicleDetail;