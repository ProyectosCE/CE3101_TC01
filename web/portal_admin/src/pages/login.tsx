import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './index';

const LoginPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    localStorage.setItem('session', 'true');
    setIsLoggedIn(true);
    router.push('/'); // Redirect to home after login
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Portal Admin TECBANK</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input type="text" className="form-control" placeholder="Ingrese su usuario" />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" placeholder="Ingrese su contraseña" />
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
