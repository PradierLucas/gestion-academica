import React, { useEffect, useState } from 'react';
import "../../App.css";
import Formulario from './forms';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Header from '../header';
import jsPDF from 'jspdf';

const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null);

  const [materias, setMaterias] = useState([]);
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [showModalInscripcion, setShowModalInscripcion] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const rol = parseInt(localStorage.getItem('rol'));

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
            fetch(`http://localhost:8080/api/alumnos/${id}`, {
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



  // Toggle Materias Selection
  const toggleMateriaSelection = (materiaId) => {
    setSelectedMaterias((prev) =>
      prev.includes(materiaId)
        ? prev.filter((id) => id !== materiaId)
        : [...prev, materiaId]
    );
  };

  const handleEnroll = () => {
    const payload = {
      alumno_id: selectedAlumnoId,
      materias: selectedMaterias,
    };

    fetch('http://localhost:8080/api/inscribir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          toast("Inscripción realizada con éxito");


        } else {
          toast.error(data.message || "Error al realizar la inscripción");
        }
      })
      .catch(error => {
        console.error('Error al inscribir en materias:', error);
        toast.error("Error al inscribir en las materias");
      });

    setShowModalInscripcion(false);
    setSelectedMaterias([]);
  };


  const fetchAlumnos = () => {
    fetch('http://localhost:8080/api/alumnos')
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
      fetchAlumnos(); // Si no hay término de búsqueda, cargamos todas las materias
      return;
    }

    fetch(`http://localhost:8080/api/alumnos/buscar?term=${term}`)
      .then(response => response.json())
      .then(data => setAlumnos(data))
      .catch(error => {
        console.error('Error al buscar alumnos:', error);
        toast.error("Error al buscar alumnos");
      });
  };


  // Descargar como PDF
  const handleDownloadPDF = () => {
    if (!alumnos.length === 0) {
      toast.info("No hay datos para exportar.");
      return;
    }
    const fecha = (new Date().toLocaleDateString())

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Fecha ${fecha}`, 10, 10);

    doc.text(`Alumnos :`, 10, 20);

    let y = 30;
    alumnos.forEach((alumno, index) => {
      doc.text(`${index + 1}. ${alumno.nombre} (DNI: ${alumno.dni})`, 10, y);
      y += 10;
    });

    doc.save(`alumnos-${fecha}.pdf`);
  };



  return (
    <>
      <Header></Header>


      {rol !== 1 && (
        <div className="container">
          <h2 className="my-4">Lista de Alumnos</h2>

          <div className='row align-content-center '>


            <div className='col-6 '>
              <div className="mb-3 w-75">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o dni"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className='col-2 '>
              <button className="btn btn-primary me-2" onClick={handleDownloadPDF}>
                Descargar Lista
              </button>
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
                  alumnos.map((alumno) => (
                    <tr key={alumno.id}>
                      <td>{alumno.nombre}</td>
                      <td>{alumno.dni}</td>
                      <td>{alumno.edad}</td>
                      <td>

                        {alumno.estado === 1 && (
                          <>
                            <button
                              className="btn btn-info btn-sm  me-2"
                              onClick={() => {
                                setSelectedAlumnoId(alumno.id);
                                setShowModalInscripcion(true);
                              }}
                            >
                              Inscribir a Materias
                            </button>

                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            <br></br>

          </div>
        </div>
      )}


      {rol === 1 && (
        <div className="container">
          <h2 className="my-4">Lista de Alumnos</h2>

          <div className='row align-content-center '>
            <div className='col-4'>

              <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
                Agregar Alumno
              </button>
            </div>

            <div className='col-6 '>
              <div className="mb-3 w-75">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o dni"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className='col-2 '>
              <button className="btn btn-primary me-2" onClick={handleDownloadPDF}>
                Descargar Lista
              </button>
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
                  alumnos.map((alumno) => (
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
                        {alumno.estado === 1 && (
                          <>
                            <button
                              className="btn btn-info btn-sm  me-2"
                              onClick={() => {
                                setSelectedAlumnoId(alumno.id);
                                setShowModalInscripcion(true);
                              }}
                            >
                              Inscribir a Materias
                            </button>

                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            <br></br>

          </div>
        </div>)}



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

      {showModalInscripcion && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Materias</h5>
                <button type="button" className="btn-close" onClick={() => setShowModalInscripcion(false)}></button>
              </div>
              <div className="modal-body">
                {materias.map((materia) => (
                  <div className="form-check" key={materia.id}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`materia-${materia.id}`}
                      checked={selectedMaterias.includes(materia.id)}
                      onChange={() => toggleMateriaSelection(materia.id)}
                    />
                    <label className="form-check-label" htmlFor={`materia-${materia.id}`}>
                      {materia.nombre} - {materia.carrera}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleEnroll}>
                  Inscribir
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModalInscripcion(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </>
  );
};

export default AlumnosList;
