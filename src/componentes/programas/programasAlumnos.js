import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Header from '../header';


const UsuariosProgramas = () => {
    const [programas, setProgramas] = useState([]);
    const [selectedProgramaId, setSelectedProgramaId] = useState(null);
    const [usuariosAsociados, setUsuariosAsociados] = useState([]);

    // Fetch all programas
    useEffect(() => {
        fetch('http://localhost:8080/api/programas')
            .then(response => response.json())
            .then(data => setProgramas(data))
            .catch(error => console.error('Error al cargar programas:', error));
    }, []);

    // Fetch usuarios asociados al programa seleccionado
    useEffect(() => {
        if (selectedProgramaId) {
            fetch(`http://localhost:8080/api/usuarios/programa/${selectedProgramaId}`)
                .then(response => response.json())
                .then(data => setUsuariosAsociados(data))
                .catch(error => console.error('Error al cargar usuarios asociados:', error));
        }
    }, [selectedProgramaId]);

    // Desasociar usuario
    const handleDesasociar = (usuarioId) => {
        fetch('http://localhost:8080/api/programas/desasociar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, programa_id: selectedProgramaId }),
        })
            .then(response => response.json())
            .then(data => {
                toast.success("Usuario desasociado del programa");
                setUsuariosAsociados(usuariosAsociados.filter(usuario => usuario.id !== usuarioId));
            })
            .catch(error => {
                console.error('Error al desasociar usuario del programa:', error);
                toast.error("No se pudo desasociar el usuario del programa");
            });
    };

    // Descargar como PDF
    const handleDownloadPDF = () => {
        if (!selectedProgramaId || usuariosAsociados.length === 0) {
            toast.info("No hay datos para exportar.");
            return;
        }
        const fecha = new Date().toLocaleDateString();
        const programa = programas.find(p => p.id === parseInt(selectedProgramaId));
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Fecha: ${fecha}`, 10, 10);
        doc.text(`Usuarios asociados al Programa: ${programa.nombre}`, 10, 20);
        doc.setFontSize(12);
        doc.text(`URL: ${programa.url || 'N/A'}`, 10, 30);
        doc.text(`Estado: ${programa.estado || 'N/A'}`, 10, 40);
        doc.text(`Usuarios Asociados:`, 10, 50);

        let y = 60;
        usuariosAsociados.forEach((usuario, index) => {
            doc.text(`${index + 1}. ${usuario.nombre} (DNI: ${usuario.dni})`, 10, y);
            y += 10;
        });

        doc.save(`${programa.nombre}-usuarios-${fecha}.pdf`);
    };

    return (
        <>
         <Header></Header>
            <div className="container">
                <h2 className="my-4">Programas</h2>

                <div className="mb-3">
                  
                    <select
                        id="programa"
                        className="form-select"
                        value={selectedProgramaId || ''}
                        onChange={(e) => setSelectedProgramaId(e.target.value)}
                    >
                        <option value="">Seleccione un programa</option>
                        {programas.map(programa => (
                            programa.estado ===1 &&
                             <option key={programa.id} value={programa.id}>{programa.nombre}</option>
                            
                           
                        ))}
                    </select>
                </div>

                {selectedProgramaId && (
                    <>
                         
                    <div className='row align-content-center'>
                        <div className='col-6 me-2'>
                        <h4 >Alumnos vinculados</h4>
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
                                {usuariosAsociados.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            <p>No hay usuarios asociados a este programa.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    usuariosAsociados.map(usuario => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.dni}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDesasociar(usuario.id)}
                                                >
                                                    Desasociar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>

                        <br></br><br></br><br></br><br></br><br></br><br></br>
                    </>
                )}
            </div>
        </>
    );
};

export default UsuariosProgramas;
