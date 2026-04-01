import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/vehicle.css';

function VehicleForm({ initialData = {}, onSubmit, submitLabel }) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState(initialData.brand || "");
  const [model, setModel] = useState(initialData.model || "");
  const [year, setYear] = useState(initialData.year || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(initialData.status || "available");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("description", description);
    // Si es edición, usar el estado seleccionado: si es registro available
    if (initialData && initialData.brand) {
      formData.append("status", status);
    } else {
      formData.append("status", "available");
    }
    if (image) formData.append("image", image);

    try {
      await onSubmit(formData);
      alert("Operation successful");
      // Limpia campos solo si es registro
      if (!initialData.brand) {
        setBrand(""); setModel(""); setYear(""); setPrice(""); setDescription(""); setImage(null);
      }
    } catch (error) {
      alert("Error in the operation");
    }
  };

  return (
    <div className="simple-form-wrapper" style={{ background: '#161515', minHeight: '100vh', width: '100vw' }}>
      <form className="simple-form-container" onSubmit={handleSubmit} style={{ maxWidth: '1200px', width: '100%', minHeight: '220px', padding: '32px 64px', marginTop: '48px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '24px' }}>
          {initialData && initialData.brand ? 'Edit Vehicle' : 'Register Vehicle'}
        </h2>
        <input type="text" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} required />
        <input type="text" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} required />
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required min={1900} max={new Date().getFullYear()} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required min={0} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        {initialData && initialData.brand && (
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ marginBottom: '16px',  background: '#222', color: '#fff', border: '1px solid #444', padding: '8px' }}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        )}
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">{submitLabel || "Save"}</button>
        <button type="button" style={{ background: '#444', marginTop: '12px' }} onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
}

export default VehicleForm;
