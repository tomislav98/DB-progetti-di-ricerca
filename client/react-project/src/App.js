import React from 'react';
import './App.scss';
import Sign from './Components/SignIn/SignIn';
import Landing from './Components/Landing/Landing';
import Register from "./Components/Register/Register"
import { Routes, Route } from "react-router-dom";
import Main from './Components/MainPage/Main';
import { MantineProvider, createTheme } from '@mantine/core';

const myColor = [
  '#eef3ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc1',
  '#5f7cb8',
  '#5474b4',
  '#44639f',
  '#39588f',
  '#2d4b81'
];

const theme = createTheme({
  colors: {
    myColor,
  }
});

// TODO da proteggere le PRIVATE route, in base al ruolo dell'utente (admin researcher evaluator)
// TODO nell'handling di queste route o in tutte le components, redirectare in caso di jwt fallato, scaduto, non giusto per le routes
function App() {
  return (
    <div className="App">
      <MantineProvider theme={theme}>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="login" element={<Sign />} />
          <Route path="register" element={<Register />} />
          <Route path="mainpage/*" element={<Main />} />
        </Routes>
      </MantineProvider>
    </div>
  );
}

export default App;
