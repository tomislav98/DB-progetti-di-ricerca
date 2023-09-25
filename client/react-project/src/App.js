import React from 'react';
import './App.scss';
import Sign from './Components/SignIn/SignIn';
import Home from './Components/Home/Home';
import Register from "./Components/Register/Register"

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="login" element={ <Sign/> } />
        <Route path="register" element={ <Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
