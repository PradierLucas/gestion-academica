import React, { useEffect, useState } from 'react';
import Header from './header';

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
                alert(data.message);  // Show success or error message
                setAlumnosInscritos(alumnosInscritos.filter(alumno => alumno.id !== alumnoId)); // Remove alumno from list
            })
            .catch(error => console.error('Error al desinscribir al alumno:', error));
    };

    return (
        <>
            <div className="container">
                <h2 className="my-4">Inscripciones por Materia</h2>

                <div className="mb-3">
                    <label htmlFor="materia" className="form-label">Seleccionar Materia</label>
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

                {selectedMateriaId && (
                    <>
                        <h4 className="mt-4">Alumnos Inscritos en la Materia</h4>
                        <table className="table table-striped">
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
                    </>
                )}
            </div>

        </>
    );
};

export default InscripcionesMaterias;
