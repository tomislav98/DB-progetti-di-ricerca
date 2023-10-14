import "./register.scss"
import unive from '../../assets/frog-face-svgrepo-com.svg'
import { useEffect, useState, useCallback } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';
import Slide from "@mui/material/Slide";

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

// function checkNumber(number) {
//     const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
//     return regex.test(number);
// }

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

function renderUserType(type) {
    switch (type) {
        case 0:
            return <strong>RESEARCHER</strong>
        case 1:
            return <strong>EVALUATOR</strong>
        default:
            return null
    }
}

function RegisterSuccess() {
    return (
        <div className="container py-5">
            <div className="p-5 text-center bg-body-tertiary">
                <svg className="bi mt-5 mb-3" width="48" height="48">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                    </svg>
                </svg>
                <h1 className="text-body-emphasis">Registrazione effettuata</h1>
                <p className="col-lg-6 mx-auto mb-4 text-muted">
                    Ti ringraziamo, la registrazione è avvenuta con successo. Tra qualche secondo verrai reindirizzato alla pagina di login.
                </p>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}


function Register() {
    const [name, setName] = useState("");
    const [scndName, setScndName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("weak");
    const [userType, setUserType] = useState(2);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [completed, setCompleted] = useState(true)
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const [snackbarComp, setSnackbarComp] = useState()
    const [loading, setLoading] = useState(false);
    const [isDbEmpty, setDbEmpty] = useState(false);

    const checkForm = useCallback(() => {
        return (
            checkName(name) &&
            checkName(scndName) &&
            checkMail(mail) &&
            checkPassword(password) &&
            userType !== 2
        );
    }, [name, scndName, mail, password, userType]);


    useEffect(() => {

        axios.get('http://localhost:5000/unauth-user/', {

        })
            .then((response) => {
                if (response && response.data) {
                    setDbEmpty(response.data.response)
                }
            })
            .catch((err) => {
                console.error('Error: ' + err)
            })

    }, [])

    useEffect(() => {
        const isFormValid = checkForm();
        setCompleted(!isFormValid);
    }, [checkForm]);

    function TransitionLeft(props) {
        return <Slide {...props} direction="left" />
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        if (registerSuccess)
            navigate("/login")
    };

    function changeName(event) {
        const { value } = event.target;
        setName(value);
        setCompleted(!checkForm())
    }

    function changeSecondName(event) {
        const { value } = event.target;
        setScndName(value);
        setCompleted(!checkForm())
    }

    function changeMail(event) {
        const { value } = event.target;
        setMail(value);
        setCompleted(!checkForm())
    }

    function checkPasswordStrength(event) {
        const newPassword = event.target.value;
        setPassword(newPassword);

        // Verifica la forza della password
        const hasSpecialCharacter = /[!@#$%^&*()-_=+[\]{};':"\\|,.<>?]/.test(newPassword);
        const meetsLengthRequirement = newPassword.length >= 8 && newPassword.length <= 20;
        const meetsAlphaNumericRequirement = /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword);

        if (meetsLengthRequirement && meetsAlphaNumericRequirement) {
            if (hasSpecialCharacter) {
                setPasswordStrength("strong");
            } else {
                setPasswordStrength("medium");
            }
        } else if (newPassword.length >= 20) {
            setPasswordStrength("too long");
        } else if (newPassword.length >= 6) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("weak");
        }
    }

    async function handleRegistration(event) {
        event.preventDefault(); // Evita il comportamento predefinito del modulo

        const requestBody = {
            name: name,
            surname: scndName,
            password: password,
            email: mail,
            type_user: userType
        };

        try {
            // Effettua la richiesta POST
            setLoading(true)
            const response = await axios.post("http://localhost:5000/user/register", requestBody, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                setRegisterSuccess(true);
            }
            setAlert(response.status);
            setSnackbarOpen(true);
        } catch (error) {
            if (error.response) {
                console.log(error.response)
                setAlert(error.response.status);
                setSnackbarOpen(true);
            } else {
                alert("Qualcosa di strano e andato storto")
            }
        }
        finally {
            setLoading(false)
        }
    }

    function ChangeUserType(event) {
        const selectedValue = event.target.value;

        // Imposta lo stato userType in base alla selezione
        if (selectedValue === "0") {
            setUserType(0); // Researcher
        } else if (selectedValue === "1") {
            setUserType(1); // Evaluator
        } else {
            setUserType(2); // Default a 0 se è stata scelta l'opzione "Choose..."
        }
        setCompleted(!checkForm())
    }

    function setAlert(code = 200) {
        switch (code) {
            case 201:
                setSnackbarComp(
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Registrazione completata!
                    </Alert>)
                break;
            case 400:
                setSnackbarComp(<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Wrong request!
                </Alert>)
                break;

            case 409:
                setSnackbarComp(<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Email already in use!
                </Alert>)
                break;
            default:
                setSnackbarComp(<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Something went wrong.
                </Alert>
                )
        }
    }

    return (

        <div className="container my-container-block">
            {!registerSuccess ?
                <main>
                    <div className="py-5 text-center">
                        <img className="d-block mx-auto mb-4" src={unive} alt="" width="72" height="57" />
                        <h2>Register form</h2>
                        <p className="lead">Register to the system as Researcher or Evaluator. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
                    </div>

                    <div className="row g-5" style={{ "flexWrap": "wrap-reverse" }}>
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
                                    <div >
                                        <h6 className="my-0">User type</h6>
                                        {renderUserType(userType)}
                                    </div>
                                    {doneCheck(userType !== 2)}
                                </li>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <div >
                                        <h6 className="my-0">Password</h6>
                                        <small className="text-muted password-strength">
                                            {
                                                password.length !== 0 ?
                                                    (<small className="text-muted password-strength">
                                                        Password Strength:{" "}
                                                        <span className={`password-strength-${passwordStrength}`}>
                                                            {passwordStrength.toUpperCase()}
                                                        </span>
                                                    </small>)
                                                    :
                                                    null
                                            }
                                        </small>
                                    </div>
                                    {doneCheck(checkPassword(password))}
                                </li>
                            </ul>

                            <div className="input-group">
                                <button className="w-100 btn btn-primary btn-lg" type="submit" onClick={handleRegistration} disabled={completed}>Register
                                    {loading ?
                                        <div className="spinner-border text-light my-spinner" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        :
                                        null
                                    }
                                </button>
                                {isDbEmpty? <p className="text-muted small"> You are the first user, you will be register as an admin  </p>: null}
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
                                        {
                                            password.length !== 0 ?
                                                (<small className="text-muted password-strength">
                                                    {" "}{" "}
                                                    <span className={`password-strength-${passwordStrength}`}>
                                                        {passwordStrength.toUpperCase()}
                                                    </span>{" "}
                                                </small>)
                                                :
                                                null
                                        }
                                        <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" onChange={checkPasswordStrength} />

                                        <div id="passwordHelpBlock" className="form-text">
                                            Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                                        </div>
                                    </div>


                                    <div className="col-md-7">
                                        <label htmlFor="address" className="form-label">Phone number <span className="text-muted">(Optional)</span></label>
                                        <input type="text" className="form-control" id="address" placeholder="+393333333333" />
                                        <div className="invalid-feedback">
                                            Please enter your shipping address.
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <label htmlFor="country" className="form-label">Role </label>

                                        {
                                            isDbEmpty ?
                                                <select className="form-select" id="country" required onChange={ChangeUserType}>
                                                    <option value="">Choose...</option>
                                                    <option value="0">Admin</option>
                                                </select>
                                                :
                                                <select className="form-select" id="country" required onChange={ChangeUserType}>
                                                    <option value="">Choose...</option>
                                                    <option value="0">Researcher</option>
                                                    <option value="1">Evaluator</option>
                                                </select>
                                                
                                        }

                                        <div className="invalid-feedback">
                                            Please select a valid role.
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                :
                <RegisterSuccess />
            }


            <footer className="my-5 pt-5 text-muted text-center text-small">
                <p className="mb-1">&copy; 2022–2023 Tuby Squad</p>
                <ul className="list-inline">
                    <li className="list-inline-item"><a href="#">Privacy</a></li>
                    <li className="list-inline-item"><a href="#">Terms</a></li>
                    <li className="list-inline-item"><a href="#">Support</a></li>
                </ul>
            </footer>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={TransitionLeft}>
                {snackbarComp}
            </Snackbar>
        </div>
    )
}

export default Register;