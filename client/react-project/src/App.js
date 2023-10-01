import React from 'react';
import './App.scss';
import Sign from './Components/SignIn/SignIn';
import Landing from './Components/Landing/Landing';
import Register from "./Components/Register/Register"
import { Routes, Route } from "react-router-dom";
import Main from './Components/MainPage/Main';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <div className="App">
      <MantineProvider>

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
