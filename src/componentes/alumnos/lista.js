import React, { useEffect, useState } from 'react';
import "../../App.css";
import Formulario from './forms';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null);

  const [materias, setMaterias] = useState([]);
  const [showModalInscripcion, setShowModalInscripcion] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchAlumnos();
  }, [showModal]);

  useEffect(() => {
    fetch('http://localhost:8080/api/materias')
      .then(response => response.json())
      .then(data => setMaterias(data))
      .catch(error => console.error('Error al cargar materias:', error));
  }, []);

  const handleEdit = (id) => {
    setSelectedAlumnoId(id);  // Establecer el ID del alumno a editar
    setShowModal(true);  // Mostrar el modal
  };

  const handleDelete = (id) => {
    // Mostrar confirmación antes de eliminar
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            fetch(`http://localhost:8080/api/usuarios/${id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setAlumnos(alumnos.filter(alumno => alumno.id !== id));
                toast.success("Alumno eliminado correctamente");
              })
              .catch(error => {
                console.error('Error al eliminar el alumno:', error);
                toast.error("Error al eliminar el alumno");
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
    setSelectedAlumnoId(null);
    setShowModalInscripcion(false);
  }

  const handleInscripcion = (id) => {
    setSelectedAlumnoId(id);  // Set the selected student ID
    setShowModalInscripcion(true);  // Open modal to choose subjects
  };

  const handleEnroll = (materiaId) => {
    fetch('http://localhost:8080/api/inscribir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alumno_id: selectedAlumnoId, materia_id: materiaId }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Inscripción realizada con éxito") {
        toast.success(data.message);
        setShowModalInscripcion(false);  // Cerrar el modal solo si la inscripción fue exitosa
      } else {
        toast.error(data.message);  // Mostrar mensaje de error si ya está inscrito o hay otro problema
      }
    })
    .catch(error => {
      console.error('Error al inscribir en materia:', error);
      toast.error("Error al inscribir en la materia");  // Mensaje de error en caso de fallo de conexión
    });
  };

  const fetchAlumnos = () => {
    fetch('http://localhost:8080/api/usuarios')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAlumnos(data);
        } else {
          console.error('Los datos de alumnos no son un arreglo:', data);
          setAlumnos([]);  // Asegurarse de que el estado sea un arreglo vacío en caso de error
        }
      })
      .catch(error => console.error('Error al cargar alumnos:', error));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.trim() === '') {
      fetchAlumnos(); // Si no hay término de búsqueda, cargamos todos los alumnos
      return;
    }
  
    fetch(`http://localhost:8080/api/alumnos/buscar?term=${term}`)
      .then(response => response.json())
      .then(data => {
        // Asegurarse de que la respuesta sea un arreglo
        if (Array.isArray(data)) {
          setAlumnos(data); // Actualiza la lista de alumnos con los resultados de la búsqueda
        } else {
          console.error('Los datos de la búsqueda no son un arreglo:', data);
          setAlumnos([]);  // Establecer un arreglo vacío si no hay resultados
        }
      })
      .catch(error => {
        console.error('Error al buscar alumnos:', error);
        toast.error("Error al buscar alumnos");
      });
  };

  return (
    <div className="container">
      <h2 className="my-4">Lista de Alumnos</h2>

      <div className='row'>
        <div className='col-6'>
          <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
            Agregar Alumno
          </button>
        </div>
        <div className='col-6'>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o dni"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className='table-responsive'>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Edad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length > 0 ? (
              alumnos.map(alumno => (
                <tr key={alumno.id}>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.dni}</td>
                  <td>{alumno.edad}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(alumno.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(alumno.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleInscripcion(alumno.id)}
                    >
                      Inscribir a Materias
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No se encontraron resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Bootstrap para Agregar o Editar Alumno */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedAlumnoId ? "Editar Alumno" : "Agregar Alumno"}</h5>
                <button type="button" className="btn-close" onClick={() => handleClose()}></button>
              </div>
              <div className="modal-body">
                <Formulario 
                  id={selectedAlumnoId} 
                  handleClose={handleClose}
                  onCancel={() => { 
                    setShowModal(false);
                    setSelectedAlumnoId(null);
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Inscripción en Materias */}
      {showModalInscripcion && selectedAlumnoId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Inscribir a Materias</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <h5 className="mb-3 text-center">Selecciona las materias para inscribir al alumno</h5>
                <ul className="list-group">
                  {materias.map(materia => (
                    <li key={materia.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{materia.nombre}</span>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleEnroll(materia.id)}>
                        Inscribir
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumnosList;
