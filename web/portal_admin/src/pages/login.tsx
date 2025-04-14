import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './index';
import { API_ENDPOINT } from '@/config/api';

const LoginPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_ENDPOINT}AdminLogin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401) {
        setError('Usuario o contraseña inválidos');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.login === 'valid') {
        localStorage.setItem('session', 'true');
        setIsLoggedIn(true);
        router.push('/'); // Redirect to home after login
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Portal Admin TECBANK</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
