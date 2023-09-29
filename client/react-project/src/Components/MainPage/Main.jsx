import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHome, faDashboard, faShippingFast, faProjectDiagram, faPerson } from '@fortawesome/free-solid-svg-icons'
import './main.scss'
import Home from './Home/Home'
import { Routes, Route } from "react-router-dom";
import Project from './Project/Project';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/base';
import { useState } from 'react';

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
const customers = <FontAwesomeIcon icon={faPerson}/>

function Main() {
    const navigate = useNavigate();
    const [selectedItem,setSelectedItem] = useState(0);

    function handleButton(label) {
        switch (label) {
            case "Home":
                navigate('/mainpage/')
                break;
            case "Dashboard":
                navigate('/mainpage/dashboard')
                break;
            case "Orders":
                navigate('/mainpage/orders')
            break;
            case "Projects":
                navigate('/mainpage/projects')
            break;
            case "Customers":
                navigate('/mainpage/customers')
            break;
            default:
                break;
        }
    }

    return (
        <main className='d-flex flex-nowrap main-container'>

            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar-container" style={{ width: "280px" }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="me-2" width="40" height="32">{element}</svg>
                    <span className="fs-4">Dashboard</span>
                </a>
                <hr className='my-hr'></hr>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Button className="nav-link text-white my-button" aria-current="page" onClick={() => { handleButton('Home') }}>
                            <svg className="me-2" width="16" height="16">{home}</svg>
                            Home
                        </Button>
                    </li>
                    <li>
                        <Button className="nav-link text-white my-button" onClick={() => { handleButton('Dashboard') }}>
                            <svg className="bi pe-none me-2" width="16" height="16">{dashboard}</svg>
                            Dashboard
                        </Button>
                    </li>
                    <li>
                        <Button className="nav-link text-white my-button" onClick={() => { handleButton('Orders') }}>
                            <svg className="bi pe-none me-2" width="16" height="16">{orders}</svg>
                            Orders
                        </Button>
                    </li>
                    <li>
                        <Button className="nav-link text-white my-button" onClick={() => { handleButton('Projects') }} >
                            <svg className="bi pe-none me-2" width="16" height="16">{projects}</svg>
                            Projects
                        </Button>
                    </li>
                    <li>
                        <Button className="nav-link text-white my-button" onClick={() => { handleButton('Customers') }}>
                            <svg className="bi pe-none me-2" width="16" height="16">{customers}</svg>
                            Customers
                        </Button>
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
            <div className="b-example-divider b-example-vr"></div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Project />} />
            </Routes>
        </main>
    )
}

export default Main;