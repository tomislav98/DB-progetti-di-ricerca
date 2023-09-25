import "./register.scss"
import unive from '../../assets/Cat Icon 1.svg'
import { useEffect, useState } from "react";
import axios from "axios"

const SERVER_URL = process.env.SERVER_URL;

const doneCheck = (isDone) => {
    if (isDone)
        return (
            <span className="text-success">✓</span>
        )
    else
        return (
            <span className="text-danger">✗</span>
        )
}

function checkName(name) {
    // Verifica che il nome non contenga caratteri speciali o numeri
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
}

function checkNumber(number) {
    const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
    return regex.test(number);
}

function checkMail(email) {
    // Espressione regolare per il formato dell'email
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function checkPassword(password) {
    // Espressione regolare per verificare la password
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return regex.test(password);
}

function Register() {
    const [name, setName] = useState("");
    const [scndName, setScndName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("weak");
    const [userType, setUserType] = useState(0); // Imposta il valore predefinito a 0 (Researcher)

    function changeName(event) {
        const { value } = event.target;
        setName(value);
    }

    function changeSecondName(event) {
        const { value } = event.target;
        setScndName(value);
    }

    function changeMail(event) {
        const { value } = event.target;
        setMail(value);
    }

    function checkPasswordStrength(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);

        // Verifica la forza della password
        if (newPassword.length >= 8 && newPassword.length <= 20 && /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) && !/\s/.test(newPassword) && !/[\x00-\x1F\x7F-\x9F]/.test(newPassword)) {
            setPasswordStrength("strong");
        } else if (newPassword.length >= 6) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("weak");
        }
    }

    async function handleRegistration(event) {
        event.preventDefault(); // Evita il comportamento predefinito del modulo

        // Verifica che tutti i campi richiesti siano stati compilati correttamente
        if (!checkName(name) || !checkName(scndName) || !checkMail(mail)) {
            alert("Si prega di compilare tutti i campi correttamente.");
            return;
        }

        // Crea il corpo della richiesta
        const requestBody = {
            name: name,
            surname: scndName,
            password: "cela", // Aggiungi la password appropriata
            email: mail,
            type_user: userType
        };

        try {
            // Effettua la richiesta POST
            const response = await axios.post(SERVER_URL, requestBody);

            // Verifica la risposta dal server e gestisci di conseguenza
            if (response.status === 200) {
                alert("Registrazione completata con successo!");
                // Esegui azioni aggiuntive, come il reindirizzamento a un'altra pagina
            } else {
                alert("Errore durante la registrazione. Si prega di riprovare.");
            }
        } catch (error) {
            console.error("Errore durante la richiesta di registrazione:", error);
            alert("Errore durante la registrazione. Si prega di riprovare.");
        }
    }

    return (
        <div className="container my-container-block">
            <main>
                <div className="py-5 text-center">
                    <img className="d-block mx-auto mb-4" src={unive} alt="" width="72" height="57" />
                    <h2>Register form</h2>
                    <p className="lead">Register to the system as Researcher or Evaluator. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
                </div>

                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Resume</span>
                            <span className="badge bg-primary rounded-pill">i</span>
                        </h4>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">Your name</h6>
                                    <small className="text-muted">{name}</small>
                                </div>
                                {doneCheck(checkName(name))}
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">Your second name</h6>
                                    <small className="text-muted">{scndName}</small>
                                </div>
                                {doneCheck(checkName(scndName))}
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">Email</h6>
                                    <small className="text-muted">{mail}</small>
                                </div>
                                {doneCheck(checkMail(mail))}
                            </li>
                            <li className="list-group-item d-flex justify-content-between bg-light">
                                <div className="text-success">
                                    <h6 className="my-0">User type</h6>
                                    <small>RESEARCHER</small>
                                </div>
                                <span className="text-success">✗</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (USD)</span>
                                <strong>$20</strong>
                            </li>
                        </ul>

                        <div className="input-group">
                            <button className="w-100 btn btn-primary btn-lg" type="submit">Register </button>

                        </div>
                    </div>
                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Submit your informations</h4>
                        <form className="needs-validation" noValidate>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="firstName" placeholder="" onChange={changeName} required />
                                    <div className="invalid-feedback">
                                        Valid first name is required.
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="lastName" placeholder="" onChange={changeSecondName} required />
                                    <div className="invalid-feedback">
                                        Valid last name is required.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="email" className="form-label">Email <span className="text-muted"></span></label>
                                    <input type="email" className="form-control" id="email" placeholder="you@example.com" onChange={changeMail} />
                                    <div className="invalid-feedback">
                                        Please enter a valid email address for shipping updates.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                                    <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" onChange={checkPasswordStrength} />
                                    <div id="passwordHelpBlock" className="form-text">
                                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                                    </div>
                                    {
                                    password.length!=0 ?
                                        (<small className="text-muted password-strength">
                                            Password Strength:{" "}
                                            <span className={`password-strength-${passwordStrength}`}>
                                                {passwordStrength.toUpperCase()}
                                            </span>
                                        </small>)
                                        :
                                        null
                                    }
                                </div>


                                <div className="col-12">
                                    <label htmlFor="address" className="form-label">Phone number <span className="text-muted">(Optional)</span></label>
                                    <input type="text" className="form-control" id="address" placeholder="+393333333333" />
                                    <div className="invalid-feedback">
                                        Please enter your shipping address.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="address2" className="form-label">Address <span className="text-muted">(Optional)</span></label>
                                    <input type="text" className="form-control" id="address2" placeholder="Apartment or suite" />
                                </div>

                                <div className="col-md-5">
                                    <label htmlFor="country" className="form-label">Role</label>
                                    <select className="form-select" id="country" required>
                                        <option value="">Choose...</option>
                                        <option>Researcher</option>
                                        <option>Evaluator</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Please select a valid country.
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-select" id="state" required>
                                        <option value="">Choose...</option>
                                        <option>California</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Please provide a valid state.
                                    </div>
                                </div>

                                <div className="col-md-3 button-flex">

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="my-5 pt-5 text-muted text-center text-small">
                <p className="mb-1">&copy; 2022–2023 Company Name</p>
                <ul className="list-inline">
                    <li className="list-inline-item"><a href="#">Privacy</a></li>
                    <li className="list-inline-item"><a href="#">Terms</a></li>
                    <li className="list-inline-item"><a href="#">Support</a></li>
                </ul>
            </footer>
        </div>
    )
}

export default Register;