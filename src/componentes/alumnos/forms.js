// Formulario.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
const Formulario = ({ id, handleClose, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    edad: '',
  });

  useEffect(() => {
    if (id) {
        // Cargar los datos del alumno para editar
        fetch(`http://localhost:8080/api/usuarios/${id}`)
            .then(response => response.json())
            .then(data => setFormData(data))
            .catch(error => console.error('Error al cargar el alumno:', error));
    }
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = id 
      ? `http://localhost:8080/api/usuarios/${id}` 
      : 'http://localhost:8080/api/usuarios';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        toast.success("Alumno guardado correctamente");
        handleClose();  // Llamar a la función onSave con los datos actualizados
      })
      .catch(error => {console.error('Error al guardar el alumno:', error); 
              toast.error("No se pudo guardar correctamente");});
  };

  return (
    <div className="container p-4">
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
      
        
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="form-control"
            required
          />
        </div>
        
      
        
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input
            type="number"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="DNI"
            className="form-control"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
