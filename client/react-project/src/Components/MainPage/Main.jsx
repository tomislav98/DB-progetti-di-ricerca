import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHome, faDashboard, faShippingFast, faProjectDiagram, faPerson } from '@fortawesome/free-solid-svg-icons'
import './main.scss'
import Home from './Home/Home'
import { Routes, Route } from "react-router-dom";
import Project from './Project/Project';
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
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar-container" style={{ width: "280px", position:'absolute' }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="me-2" width="40" height="32">{element}</svg>
                    <span className="fs-4">Dashboard</span>
                </a>
                <hr className='my-hr'></hr>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        {selectedItem === 0 ?
                            <Button className="nav-link active my-button" aria-current="page" onClick={() => { handleButton('Home') }}>
                                <svg className="me-2" width="16" height="16">{home}</svg>
                                Home
                            </Button>
                            :
                            <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Home') }}>
                                <svg className="me-2" width="16" height="16">{home}</svg>
                                Home
                            </Button>
                        }
                    </li>
                    <li>
                        {selectedItem === 1 ?
                            <Button className="nav-link active my-button" aria-current="page" onClick={() => { handleButton('Dashboard') }}>
                                <svg className="me-2" width="16" height="16">{dashboard}</svg>
                                Dashboard
                            </Button>
                            :
                            <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Dashboard') }}>
                                <svg className="me-2" width="16" height="16">{dashboard}</svg>
                                Dashboard
                            </Button>
                        }
                    </li>
                    <li>
                        {selectedItem === 2 ?
                            <Button className="nav-link active my-button" aria-current="page" onClick={() => { handleButton('Orders') }}>
                                <svg className="me-2" width="16" height="16">{orders}</svg>
                                Orders
                            </Button>
                            :
                            <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Orders') }}>
                                <svg className="me-2" width="16" height="16">{orders}</svg>
                                Orders
                            </Button>
                        }
                    </li>
                    <li>
                        {selectedItem === 3 ?
                            <Button className="nav-link active my-button" aria-current="page" onClick={() => { handleButton('Projects') }}>
                                <svg className="me-2" width="16" height="16">{home}</svg>
                                Projects
                            </Button>
                            :
                            <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Projects') }}>
                                <svg className="me-2" width="16" height="16">{home}</svg>
                                Projects
                            </Button>
                        }
                    </li>
                    <li>
                        {selectedItem === 4 ?
                            <Button className="nav-link active my-button" aria-current="page" onClick={() => { handleButton('Customers') }}>
                                <svg className="me-2" width="16" height="16">{customers}</svg>
                                Customers
                            </Button>
                            :
                            <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Customers') }}>
                                <svg className="me-2" width="16" height="16">{customers}</svg>
                                Customers
                            </Button>
                        }
                    </li>
                </ul>
                <hr className='my-hr'></hr>
                <div className="dropdown">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                        <strong>mdo</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow" >
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
            {matches?<div className="b-example-divider b-example-vr"></div>:null}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Project onClick={closeSidebar} />} />
            </Routes>
        </main>
    )
}

export default Main;