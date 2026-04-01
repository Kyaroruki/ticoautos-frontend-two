
const VehicleManageCard = ({ vehicle, onEdit, onDelete, onMarkSold, question }) => (
    <div className="simple-card">
      <img src={vehicle.image ? `http://localhost:3000/uploads/${vehicle.image}` : '/default-car.png'} alt="auto" />
      
      <h3>{vehicle.brand} {vehicle.model}</h3>
      <p><strong>Year:</strong> {vehicle.year}</p>
      <p><strong>Price:</strong> ${vehicle.price}</p>
      <p><strong>Status:</strong> {vehicle.status}</p>
      <div className="card-actions">
        <button onClick={() => onEdit(vehicle)}>Edit</button>
        <button onClick={() => onDelete(vehicle)}>Delete</button>
        {vehicle.status === 'available' && (
          <button onClick={() => onMarkSold(vehicle)}>Mark as sold</button>
        )}
        <button onClick={() => question(vehicle)}>Question</button>
      </div>
    </div>
);

export default VehicleManageCard;