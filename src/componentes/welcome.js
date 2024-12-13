// Welcome.js
import React from 'react';
import './welcome.css'; // Importamos los estilos desde un archivo CSS
import Header from './header';


const Welcome = ({ username }) => {
  return (

    <>
    <Header></Header>
    <div className="welcome-container">
      <h1 className="welcome-title">¡Bienvenido!</h1>
      <p className="welcome-message">
      Explorá nuestro sistema y disfrutá de todas las funcionalidades.
      </p>
    
    </div>

    </>
  );
};

export default Welcome;
