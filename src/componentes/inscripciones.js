import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Header from './header';
import "../App.css";

const InscripcionesMaterias = () => {
    const [materias, setMaterias] = useState([]);
    const [selectedMateriaId, setSelectedMateriaId] = useState(null);
    const [alumnosInscritos, setAlumnosInscritos] = useState([]);

    // Fetch all materias (subjects)
    useEffect(() => {
        fetch('http://localhost:8080/api/materias')
            .then(response => response.json())
            .then(data => setMaterias(data))
            .catch(error => console.error('Error al cargar materias:', error));
    }, []);

    // Fetch alumnos inscritos en la materia seleccionada
    useEffect(() => {
        if (selectedMateriaId) {
            fetch(`http://localhost:8080/api/inscripciones/materia/${selectedMateriaId}`)
                .then(response => response.json())
                .then(data => setAlumnosInscritos(data))
                .catch(error => console.error('Error al cargar alumnos inscritos:', error));
        }
    }, [selectedMateriaId]);

    // Desinscribir alumno
    const handleDesinscribir = (alumnoId) => {
        fetch('http://localhost:8080/api/desinscribir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alumno_id: alumnoId, materia_id: selectedMateriaId }),
        })
            .then(response => response.json())
            .then(data => {
                toast.success("Alumno desinscripto");
                setAlumnosInscritos(alumnosInscritos.filter(alumno => alumno.id !== alumnoId));
            })
            .catch(error => {
                console.error('Error al desinscribir al alumno:', error);
                toast.error("No se pudo desinscribir el alumno");
            });
    };

    // Descargar como PDF
    const handleDownloadPDF = () => {
        if (!selectedMateriaId || alumnosInscritos.length === 0) {
            toast.info("No hay datos para exportar.");
            return;
        }
        const fecha = (new Date().toLocaleDateString())
        const materia = materias.find(m => m.id === parseInt(selectedMateriaId));
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Fecha ${fecha}`, 10, 10);
        doc.text(`Inscripciones para la Materia: ${materia.nombre}`, 10, 20);
        doc.setFontSize(12);
        doc.text(`Carrera: ${materia.carrera || 'N/A'}`, 10, 30);
        doc.text(`Año: ${materia.anio || 'N/A'}`, 10, 40);
        doc.text(`Alumnos Inscritos:`, 10, 50);

        let y = 60;
        alumnosInscritos.forEach((alumno, index) => {
            doc.text(`${index + 1}. ${alumno.nombre} (DNI: ${alumno.dni})`, 10, y);
            y += 10;
        });

        doc.save(`${materia.nombre}-inscripciones-${fecha}.pdf`);
    };

   

    return (
        <>
        
        <Header></Header>
            <div className="container">
                <h2 className="my-4">Inscripciones por Materia</h2>

                <div className="mb-3">
                   
                    <select
                        id="materia"
                        className="form-select"
                        value={selectedMateriaId || ''}
                        onChange={(e) => setSelectedMateriaId(e.target.value)}
                    >
                        <option value="">Seleccione una materia</option>
                        {materias.map(materia => (
                            <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                        ))}
                    </select>
                </div>
                        <br></br>
                {selectedMateriaId && (
                    <>
                    <div className='row align-content-center'>
                        <div className='col-6 me-2'>
                        <h4 >Alumnos Inscritos en la Materia</h4>
                        </div>
                        <div className='col-4 me-2'>
                        <button className="btn btn-primary me-2" onClick={handleDownloadPDF}>
                            Descargar PDF
                        </button>
                        </div>
                    </div>
                        <br></br>

                        
                        <div className='table-responsive'>
                        <table className="table table-striped text-center">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>DNI</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnosInscritos.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            <p>No hay alumnos inscritos en esta materia.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    alumnosInscritos.map(alumno => (
                                        <tr key={alumno.id}>
                                            <td>{alumno.nombre}</td>
                                            <td>{alumno.dni}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDesinscribir(alumno.id)}
                                                >
                                                    Desinscribir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        
                        </div>
                    </>
                )}
            </div>

         <br></br><br></br><br></br><br></br><br></br><br></br>
            

        </>
    );
};

export default InscripcionesMaterias;
