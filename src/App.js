// App.js
import React from 'react';
import {  Route, Routes } from 'react-router-dom';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlumnosList from './componentes/alumnos/lista';
import MateriasList from './componentes/materias/lista';
import InscripcionesMaterias from './componentes/inscripciones';

import Welcome from './componentes/welcome';

import Footer from './componentes/footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './componentes/login/login';
import Usuarios from './componentes/usuarios/usuarios';



function App() {
  return (

      <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
        <Routes>
          <Route path="/" element={<Login></Login>} />
          <Route path="/home" element={<Welcome></Welcome>} />
          <Route path="/alumnos" element={<AlumnosList />} />
          <Route path="/materias" element={<MateriasList />} />
          <Route path="/matriculas" element={<InscripcionesMaterias />} />
        {/*   <Route path="/programas" element={<Programas/>} />
          <Route path="/programasAlumnos" element={<UsuariosProgramas/>} /> */}
         <Route path="/usuarios" element={<Usuarios></Usuarios>} />
        </Routes>
   <Footer></Footer>
  
   </>
  );
}

export default App;
