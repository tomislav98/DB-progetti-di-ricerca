import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHome } from '@fortawesome/free-solid-svg-icons'
import './main.scss'

// (() => {
//     'use strict'
//     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//     tooltipTriggerList.forEach(tooltipTriggerEl => {
//       new bootstrap.Tooltip(tooltipTriggerEl)
//     })
//   })()

const element = <FontAwesomeIcon icon={faCoffee} />
const home = <FontAwesomeIcon icon={faHome} />

function Main() {


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
                        <a href="#" className="nav-link active" aria-current="page">
                            <svg className="me-2" width="16" height="16">{home}</svg>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"></svg>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"></svg>
                            Orders
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"></svg>
                            Products
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"></svg>
                            Customers
                        </a>
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
            <div class="b-example-divider b-example-vr"></div>
        </main>
    )
}

export default Main;