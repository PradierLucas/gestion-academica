import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [user, setUser] = useState({
    nombre: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then(res => res.json())
      .then((result) => {
        if (result.ok) {
       
          localStorage.setItem('rol', result.body.rol);
          localStorage.setItem('user', result.body.nombre);
    
          navigate('/home');
          toast.success(`Bienvenido ${result.body.nombre}`, {
            position: "bottom-center",
            autoClose: 5000,
          });
        } else {
          toast.error(result.message || 'Nombre o contraseña incorrectos', {
            position: "bottom-center",
            autoClose: 5000,
          });
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        toast.error("Error al conectar con el servidor", {
          position: "bottom-center",
          autoClose: 5000,
        });
      });
    
  };

  return (
    <>
      <div className="container text-center mt-5">
        <h2>Iniciar Sesión</h2>
      </div>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ingrese su nombre"
                  value={user.nombre}
                  onChange={handleInputChange}
                  name="nombre"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    value={user.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
