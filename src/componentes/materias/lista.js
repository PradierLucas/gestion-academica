import React, { useEffect, useState } from 'react';
import "../../App.css";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const MateriasList = () => {
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null);
  const [newMateria, setNewMateria] = useState({ nombre: '', carrera: '', anio: '' });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaterias();
  }, [showModal]);

  // Handle opening the modal for editing a materia
  const handleEditMateria = (id) => {
    const materia = materias.find((m) => m.id === id);
    setSelectedMateriaId(id);
    setNewMateria({ nombre: materia.nombre, carrera: materia.carrera, anio: materia.anio });
    setShowModal(true);
  };

  // Handle updating an existing materia
  const handleUpdateMateria = () => {
    fetch(`http://localhost:8080/api/materia/${selectedMateriaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMateria),
    })
      .then((response) => response.json())
      .then((data) => {
        setMaterias(
          materias.map((materia) =>
            materia.id === selectedMateriaId ? data : materia
          )
        );
        toast.success("Materia actualizada correctamente");
        setShowModal(false);
        setSelectedMateriaId(null);
        setNewMateria({ nombre: '', carrera: '', anio: '' });
      })
      .catch((error) => {
        console.error('Error al actualizar la materia:', error);
        toast.error("Error al actualizar la materia");
      });
  };

  // Handle creating a new materia
  const handleCreateMateria = () => {
    fetch('http://localhost:8080/api/materia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMateria),
    })
      .then(response => response.json())
      .then(data => {
        setMaterias([...materias, data]);
        toast.success("Materia creada correctamente");
        setShowModal(false);
        setNewMateria({ nombre: '', carrera: '', anio: '' });
      })
      .catch(error => {
        console.error('Error al crear la materia:', error);
        toast.error("Error al crear la materia");
      });
  };

  const handleMateriaChange = (e) => {
    setNewMateria({ ...newMateria, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Eliminar Materia',
      message: '¿Estás seguro de que deseas eliminar esta materia?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            fetch(`http://localhost:8080/api/materia/${id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setMaterias(materias.filter(materia => materia.id !== id));
                toast.success("Materia eliminada correctamente");
              })
              .catch(error => {
                console.error('Error al eliminar la materia:', error);
                toast.error("Error al eliminar la materia");
              });
          },
        },
        {
          label: 'No',
          onClick: () => toast.info("Eliminación cancelada"),
        },
      ],
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedMateriaId(null);
    setNewMateria({ nombre: '', carrera: '', anio: '' });
  };

  const fetchMaterias = () => {
    fetch('http://localhost:8080/api/materias')
      .then(response => response.json())
      .then(data => setMaterias(data))
      .catch(error => console.error('Error al cargar materias:', error));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      fetchMaterias(); // Si no hay término de búsqueda, cargamos todas las materias
      return;
    }

    fetch(`http://localhost:8080/api/materias/buscar?term=${term}`)
      .then(response => response.json())
      .then(data => setMaterias(data))
      .catch(error => {
        console.error('Error al buscar materias:', error);
        toast.error("Error al buscar materias");
      });
  };

  return (
    <>
      <div className="container">
        <h2 className="my-4">Lista de Materias</h2>
        <div className='row'>
        <div className='col-6'>
        <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
          Agregar Materia
        </button>

        </div>
        <div className='col-6'>
          
        <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o carrera"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

        </div>
        </div>
      

        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Año</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia.id}>
                  <td>{materia.nombre}</td>
                  <td>{materia.carrera}</td>
                  <td>{materia.anio}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditMateria(materia.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(materia.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para Crear o Editar Materia */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMateriaId ? "Editar Materia" : "Agregar Materia"}</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre de la Materia</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={newMateria.nombre}
                      onChange={handleMateriaChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carrera" className="form-label">Carrera</label>
                    <input
                      type="text"
                      className="form-control"
                      id="carrera"
                      name="carrera"
                      value={newMateria.carrera}
                      onChange={handleMateriaChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="anio" className="form-label">Año</label>
                    <input
                      type="number"
                      className="form-control"
                      id="anio"
                      name="anio"
                      value={newMateria.anio}
                      onChange={handleMateriaChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={selectedMateriaId ? handleUpdateMateria : handleCreateMateria}
                  >
                    {selectedMateriaId ? "Actualizar Materia" : "Crear Materia"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MateriasList;
