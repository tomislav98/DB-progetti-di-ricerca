import React from 'react';
import './App.scss';
import Sign from './Components/SignIn/SignIn';
import Home from './Components/Home/Home';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="auth" element={ <Sign/> } />
      </Routes>
    </div>
  );
}

export default App;
