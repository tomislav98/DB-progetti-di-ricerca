import React, { useState } from 'react';
import './sign-in.scss';
import unive from '../../assets/frog-face-svgrepo-com.svg';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { SnackbarProvider, useSnackbar, enqueueSnackbar } from 'notistack';

function Sign() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { enqueueSnackbar } = useSnackbar();

  function goMainpage(){
    navigate('/mainpage')
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        const { token } = response.data;
        // Salva il token nel local storage
        localStorage.setItem('token', token);

        // Mostra una notifica di successo
        enqueueSnackbar('Accesso riuscito! ', { variant: 'success', anchorOrigin:{horizontal:'center', vertical:'top'}, onClose:goMainpage, autoHideDuration:1000 });
        // Ora puoi fare qualcosa con il token JWT, ad esempio reindirizzare l'utente alla dashboard
        // history.push('/dashboard');
      }
    } catch (error) {
      console.error('Errore durante la richiesta di accesso:', error);

      // Mostra una notifica di errore
      enqueueSnackbar(error.response.data.error+' '+error.response.status, { variant: 'error', anchorOrigin:{horizontal:'center', vertical:'top'}  });
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
              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Sign in
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
