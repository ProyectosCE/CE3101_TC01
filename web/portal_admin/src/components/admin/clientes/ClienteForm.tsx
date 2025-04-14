const ClienteForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Número de Cédula</label>
            <input type="text" className="form-control" placeholder="123456789" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Primer Nombre</label>
            <input type="text" className="form-control" placeholder="Juan" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Segundo Nombre</label>
            <input type="text" className="form-control" placeholder="Carlos" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Primer Apellido</label>
            <input type="text" className="form-control" placeholder="Pérez" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Segundo Apellido</label>
            <input type="text" className="form-control" placeholder="Gómez" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Provincia</label>
            <input type="text" className="form-control" placeholder="San José" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cantón</label>
            <input type="text" className="form-control" placeholder="Escazú" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Distrito</label>
            <input type="text" className="form-control" placeholder="San Rafael" />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Dirección Exacta</label>
            <input type="text" className="form-control" placeholder="Calle 123, Casa 45" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input type="text" className="form-control" placeholder="8888-8888" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Ingreso mensual</label>
            <input type="number" className="form-control" placeholder="₡0.00" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Cliente</label>
            <select className="form-select">
              <option>Físico</option>
              <option>Jurídico</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuario</label>
            <input type="text" className="form-control" placeholder="usuario123" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cliente
        </button>
      </form>
    );
  };
  
  export default ClienteForm;
