import React from 'react';

const LoginPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Portal Admin TECBANK</h2>
          <form>
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
