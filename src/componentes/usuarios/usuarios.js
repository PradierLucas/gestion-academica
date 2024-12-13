import React, { useEffect, useState } from 'react';
import "../../App.css";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Header from '../header';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [newUsuario, setNewUsuario] = useState({ nombre: '', estado: '',rol:'', password: '' });

 

  useEffect(() => {
    fetchUsuarios();
  }, [showModal]);

  // Handle opening the modal for editing a Usuario
  const handleEditUsuario = (id) => {
    const Usuario = usuarios.find((m) => m.id === id);
    setSelectedUsuarioId(id);
    setNewUsuario({ nombre: Usuario.nombre, estado: Usuario.estado,rol:Usuario.rol, password: Usuario.password });
    setShowModal(true);
  };

  // Handle updating an existing Usuario
  const handleUpdateUsuario = () => {
    fetch(`http://localhost:8080/api/usuarios/${selectedUsuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUsuario),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.usuario) {
                setUsuarios(
                    usuarios.map((usuario) =>
                        usuario.id === selectedUsuarioId ? data.usuario : usuario
                    )
                );
                toast.success("Usuario actualizado correctamente");
                setShowModal(false);
                setSelectedUsuarioId(null);
                setNewUsuario({ nombre: '', estado: 1, rol: '', password: '' });
            } else {
                toast.error(data.message || "Error al actualizar el usuario");
            }
        })
        .catch((error) => {
            console.error('Error al actualizar el usuario:', error);
            toast.error("Error al actualizar el usuario");
        });
};


  // Handle creating a new Usuario
  const handleCreateUsuario = () => {
    fetch('http://localhost:8080/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUsuario),
    })
      .then(response => response.json())
      .then(data => {
        setUsuarios
        ([...usuarios, data]);
        toast.success("Usuario creada correctamente");
        setShowModal(false);
        setNewUsuario({ nombre: '', estado: 1, rol:'',password: '' });
      })
      .catch(error => {
        console.error('Error al crear la Usuario:', error);
        toast.error("Error al crear la Usuario");
      });
  };

  const handleUsuarioChange = (e) => {
    setNewUsuario({ ...newUsuario, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Eliminar Usuario',
      message: '¿Estás seguro de que deseas eliminar esta Usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            fetch(`http://localhost:8080/api/usuarios/${id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setUsuarios
                (usuarios.filter(Usuario => Usuario.id !== id));
                toast.success("Usuario eliminado correctamente");
              })
              .catch(error => {
                console.error('Error al eliminar el Usuario:', error);
                toast.error("Error al eliminar el Usuario");
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
    setSelectedUsuarioId(null);
    setNewUsuario({ nombre: '', estado: 1, rol:'',password: '' });
  };

  const fetchUsuarios= () => {
    fetch('http://localhost:8080/api/usuarios')
      .then(response => response.json())
      .then(data => setUsuarios
        (data))
      .catch(error => console.error('Error al cargar usuarios:', error));
  };



  return (
    <>

    <Header></Header>
      <div className="container">
        <h2 className="my-4">Lista de Usuarios
            
        </h2>
        
        <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
          Agregar Usuario
        </button>

       
      

        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((Usuario) => (
                <tr key={Usuario.id}>
                  <td>{Usuario.nombre}</td>
                  <td>{Usuario.estado}</td>
                  <td>{Usuario.rol}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditUsuario(Usuario.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(Usuario.id)}
                    >
                      Eliminar
                    </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para Crear o Editar Usuario */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedUsuarioId ? "Editar Usuario" : "Agregar Usuario"}</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre del Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={newUsuario.nombre}
                      onChange={handleUsuarioChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <input
                      type="number"
                      className="form-control"
                      id="estado"
                      name="estado"
                      value={newUsuario.estado}
                      onChange={handleUsuarioChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="rol" className="form-label">Rol</label>
                    <input
                      type="number"
                      className="form-control"
                      id="rol"
                      name="rol"
                      value={newUsuario.rol}
                      onChange={handleUsuarioChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="password"
                      name="password"
                      value={newUsuario.password}
                      onChange={handleUsuarioChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={selectedUsuarioId ? handleUpdateUsuario : handleCreateUsuario}
                  >
                    {selectedUsuarioId ? "Actualizar Usuario" : "Crear Usuario"}
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

export default Usuarios;
