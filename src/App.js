// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlumnosList from './componentes/alumnos/lista';
import MateriasList from './componentes/materias/lista';
import InscripcionesMaterias from './componentes/inscripciones';

import Welcome from './componentes/welcome';
import Header from './componentes/header';
import Footer from './componentes/footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (

      <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Header></Header>
        <Routes>
          <Route path="/" element={<Welcome></Welcome>} />

          <Route path="/alumnos" element={<AlumnosList />} />
          <Route path="/materias" element={<MateriasList />} />
          <Route path="/matriculas" element={<InscripcionesMaterias />} />
        </Routes>
   <Footer></Footer>
  
   </>
  );
}

export default App;
