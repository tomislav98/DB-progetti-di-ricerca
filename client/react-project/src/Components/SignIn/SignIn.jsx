
import React from 'react';
import './sign-in.scss';
import unive from '../../assets/frog-face-svgrepo-com.svg'

function Sign() {
  return (
    <div className="my-container">
      <div className="text-center my-container-flex">
        <main className="form-signin">
          <form>
            <img className="mb-4" src={unive} alt="" width="72" height="57"></img>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
              <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-muted">&copy; 2022–2023</p>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Sign;