import React, { useState } from 'react';
import './sign-in.scss';
import unive from '../../assets/frog-face-svgrepo-com.svg';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { getDecodedToken } from '../../Utils/requests';

function Sign() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function goMainpage() {
    const decodedToken = getDecodedToken()
    switch (decodedToken.role) {
      case "UserType.ADMIN":
        navigate('/mainpage/admin');
        break;
      case "UserType.RESEARCHER":
        navigate('/mainpage/projects');
        break;
      case "UserType.EVALUATOR":
        navigate('/mainpage/evaluate');
        break;
      default:

    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/user/login', {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        enqueueSnackbar('Accesso riuscito! ', { variant: 'success', anchorOrigin: { horizontal: 'center', vertical: 'top' }, onClose: goMainpage, autoHideDuration: 1000 });
      }
    } catch (error) {
      console.error('Errore durante la richiesta di accesso:', error);

      enqueueSnackbar(error.response.data.error + ' ' + error.response.status, { variant: 'error', anchorOrigin: { horizontal: 'center', vertical: 'top' } });
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <SnackbarProvider maxSnack={1}>
      <div className="my-container">
        <div className="text-center my-container-flex">
          <main className="form-signin">
            <form onSubmit={handleSignIn}>
              <img className="mb-4" src={unive} alt="" width="72" height="57"></img>
              <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="checkbox mb-3">
                <label>
                  <input type="checkbox" value="remember-me" /> Remember me
                </label>
              </div>
              <button className="w-100 btn btn-lg btn-primary" style={{ position: 'relative' }} type="submit">
                Sign in

                {loading ?
                  <div className="spinner-border text-light my-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  :
                  null
                }
              </button>
              <p className="mt-5 mb-3 text-muted">&copy; 2022–2023</p>
            </form>
          </main>
        </div>
      </div>
    </SnackbarProvider>
  );
}

export default Sign;
