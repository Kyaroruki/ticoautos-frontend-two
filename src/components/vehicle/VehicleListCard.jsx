import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/vehicle.css';

const VehicleListCard = ({ vehicle, onCopyUrl, question }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };

  return (
    <div className="simple-card">
      <img src={vehicle.image ? `http://localhost:3000/uploads/${vehicle.image}` : '/default-car.png'} alt="auto" />
      <h3>{vehicle.brand} {vehicle.model}</h3>
      <p>Year: {vehicle.year}</p>
      <p>Price: ${vehicle.price}</p>
      <p>Status: {vehicle.status}</p>
      <div className="card-actions">
        <button onClick={handleDetail}>Details</button>
        <button onClick={() => onCopyUrl(vehicle._id)}>Share</button>
        <button onClick={() => question(vehicle)}>Question</button>
      </div>
    </div>
  );
};

export default VehicleListCard;
