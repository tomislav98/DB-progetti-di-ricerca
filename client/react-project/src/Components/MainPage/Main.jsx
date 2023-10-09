import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHome, faDashboard, faShippingFast, faProjectDiagram, faPerson } from '@fortawesome/free-solid-svg-icons'
import './main.scss'
import Home from './Home/Home'
import { Routes, Route } from "react-router-dom";
import Project from './Project/Projects';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/base';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';

// (() => {
//     'use strict'
//     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//     tooltipTriggerList.forEach(tooltipTriggerEl => {
//       new bootstrap.Tooltip(tooltipTriggerEl)
//     })
//   })()

const element = <FontAwesomeIcon icon={faCoffee} />
const home = <FontAwesomeIcon icon={faHome} />
const dashboard = <FontAwesomeIcon icon={faDashboard} />
const orders = <FontAwesomeIcon icon={faShippingFast} />
const projects = <FontAwesomeIcon icon={faProjectDiagram} />
const customers = <FontAwesomeIcon icon={faPerson} />


function Toolbar(){
    return <nav className="navbar navbar-dark bg-dark my-nav">
    <a className="navbar-brand" href="#">Never expand</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample01" aria-controls="navbarsExample01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarsExample01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
              <div className="dropdown-menu" aria-labelledby="dropdown01">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
          <form className="form-inline my-2 my-md-0">
            <input className="form-control" type="text" placeholder="Search" aria-label="Search"/>
          </form>
        </div>
      </nav>
}

function Main() {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(0);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    function closeSidebar(){

    }

    // TODO fixare il fatto che quando premo freccia indietro del browser lo stato non viene cambiato a quello precedente 
    function handleButton(label) {
        switch (label) {
            case "Home":
                setSelectedItem(0);
                navigate('/mainpage/')
                break;
            case "Dashboard":
                setSelectedItem(1);
                navigate('/mainpage/dashboard')
                break;
            case "Orders":
                setSelectedItem(2);
                navigate('/mainpage/orders')
                break;
            case "Projects":
                setSelectedItem(3);
                navigate('/mainpage/projects')
                break;
            case "Customers":
                setSelectedItem(4);
                navigate('/mainpage/customers')
                break;
            default:
                break;
        }
    }

    /* TODO cos'e sta schifezza, fare la toolbar meglio e responsive*/ 
    // {matches?<Toolbar/>:null}

    return (
        
        <main className='d-flex flex-nowrap main-container'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/*" element={<Project onClick={closeSidebar} />} />
            </Routes>
        </main>
    )
}

export default Main;