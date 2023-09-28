import React from 'react';
import './App.scss';
import Sign from './Components/SignIn/SignIn';
import Landing from './Components/Landing/Landing';
import Register from "./Components/Register/Register"
import { Routes, Route } from "react-router-dom";
import Main from './Components/MainPage/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Landing/> } />
        <Route path="login" element={ <Sign/> } />
        <Route path="register" element={ <Register/>}/>
        <Route path="mainpage/*" element={ <Main/>}/>
      </Routes>
    </div>
  );
}

export default App;
