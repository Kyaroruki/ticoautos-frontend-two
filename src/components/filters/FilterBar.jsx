import React, { useState } from 'react';
import '../../styles/vehicle.css';

const initialFilters = {
  brand: '',
  model: '',
  minYear: '',
  maxYear: '',
  minPrice: '',
  maxPrice: '',
  status: '',
};
//Filters guarda los valores actuales de los filtros. InicialFilters son los filtros vacios y con set filters se actualizan
const FilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState(initialFilters);

  //extraae los valores de los inputs por name y value y los guarda en el estado de filtros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  //envia los filtros al componente padre (Home) para que ejecute la consulta con esos filtros
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  //limpia filtros y recarga la lista sin filtros
  const handleClear = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  return (
    <div className="simple-filter-bar">
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
        <input name="brand" placeholder="Brand" value={filters.brand} onChange={handleChange} />
        <input name="model" placeholder="Model" value={filters.model} onChange={handleChange} />
        <input name="minYear" type="number" placeholder="Min Year" value={filters.minYear} onChange={handleChange} />
        <input name="maxYear" type="number" placeholder="Max Year" value={filters.maxYear} onChange={handleChange} />
        <input name="minPrice" type="number" placeholder="Min Price" value={filters.minPrice} onChange={handleChange} />
        <input name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice} onChange={handleChange} />
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <button type="submit">Filter</button>
        <button type="button" onClick={handleClear} >Clear</button>
      </form>
    </div>
  );
};

export default FilterBar;
