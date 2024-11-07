// Welcome.js
import React from 'react';
import './welcome.css'; // Importamos los estilos desde un archivo CSS


const Welcome = ({ username }) => {
  return (

    <>
    <div className="welcome-container">
      <h1 className="welcome-title">¡Bienvenido, {username ? username : 'Usuario'}!</h1>
      <p className="welcome-message">
        Estamos felices de tenerte aquí. Explora nuestro sistema y disfruta de todas las funcionalidades.
      </p>
    
    </div>

    </>
  );
};

export default Welcome;
