import React, { useEffect, useState } from 'react';
import "../../App.css";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Header from '../header';

const Programas = () => {
  const [programas, setprogramas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedprogramaId, setSelectedprogramaId] = useState(null);
  const [newprograma, setNewprograma] = useState({ nombre: '', carrera: '', anio: '' });



  useEffect(() => {
    fetchprogramas();
  }, [showModal]);

  // Handle opening the modal for editing a programa
  const handleEditprograma = (id) => {
    const programa = programas.find((m) => m.id === id);
    setSelectedprogramaId(id);
    setNewprograma({ nombre: programa.nombre, url: programa.url, estado: programa.estado });
    setShowModal(true);
  };

  // Handle updating an existing programa
  const handleUpdateprograma = () => {
    fetch(`http://localhost:8080/api/programa/${selectedprogramaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newprograma),
    })
      .then((response) => response.json())
      .then((data) => {
        setprogramas(
          programas.map((programa) =>
            programa.id === selectedprogramaId ? data : programa
          )
        );
        toast.success("programa actualizada correctamente");
        setShowModal(false);
        setSelectedprogramaId(null);
        setNewprograma({ nombre: '', url: '', estado: '' });
      })
      .catch((error) => {
        console.error('Error al actualizar la programa:', error);
        toast.error("Error al actualizar la programa");
      });
  };

  // Handle creating a new programa
  const handleCreateprograma = () => {
    fetch('http://localhost:8080/api/programa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newprograma),
    })
      .then(response => response.json())
      .then(data => {
        setprogramas([...programas, data]);
        toast.success("programa creada correctamente");
        setShowModal(false);
        setNewprograma({ nombre: '', url: '', estado: '' });
      })
      .catch(error => {
        console.error('Error al crear la programa:', error);
        toast.error("Error al crear la programa");
      });
  };

  const handleprogramaChange = (e) => {
    setNewprograma({ ...newprograma, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Eliminar programa',
      message: '¿Estás seguro de que deseas eliminar esta programa?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            fetch(`http://localhost:8080/api/programa/${id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setprogramas(programas.filter(programa => programa.id !== id));
                toast.success("programa eliminada correctamente");
              })
              .catch(error => {
                console.error('Error al eliminar la programa:', error);
                toast.error("Error al eliminar la programa");
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
    setSelectedprogramaId(null);
    setNewprograma({ nombre: '', url: '', estado: '' });
  };

  const fetchprogramas = () => {
    fetch('http://localhost:8080/api/programas')
      .then(response => response.json())
      .then(data => setprogramas(data))
      .catch(error => console.error('Error al cargar programas:', error));
  };

  
  return (
    <>

    <Header></Header>
      <div className="container">
        <h2 className="my-4">Lista de programas</h2>
     
        <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
          Agregar programa
        </button>

      
 
      

        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>URL</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((programa) => (
                <tr key={programa.id}>
                  <td>{programa.nombre}</td>
                  <td>{programa.estado}</td>
                  <td>{programa.url}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditprograma(programa.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(programa.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para Crear o Editar programa */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedprogramaId ? "Editar programa" : "Agregar programa"}</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre de la programa</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={newprograma.nombre}
                      onChange={handleprogramaChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carrera" className="form-label">URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="url"
                      name="url"
                      value={newprograma.url}
                      onChange={handleprogramaChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <input
                      type="number"
                      className="form-control"
                      id="estado"
                      name="estado"
                      value={newprograma.estado}
                      onChange={handleprogramaChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={selectedprogramaId ? handleUpdateprograma : handleCreateprograma}
                  >
                    {selectedprogramaId ? "Actualizar programa" : "Crear programa"}
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

export default Programas;
