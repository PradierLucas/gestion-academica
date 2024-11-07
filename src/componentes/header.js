// Header.js
import React from 'react';
import { Link } from 'react-router-dom';  // Importamos Link para la navegación

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Sistema de Gestión
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/alumnos">
                  Alumnos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/materias">
                  Materias
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/matriculas">
                  Inscripciones
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
