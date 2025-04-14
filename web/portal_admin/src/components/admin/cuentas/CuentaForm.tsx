const CuentaForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Número de cuenta</label>
            <input type="text" className="form-control" placeholder="000-1234567890" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-control" placeholder="Cuenta de ahorro personal" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Moneda</label>
            <select className="form-select">
              <option>Colones</option>
              <option>Dólares</option>
              <option>Euros</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Tipo de cuenta</label>
            <select className="form-select">
              <option>Ahorros</option>
              <option>Corriente</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Cliente</label>
            <input type="text" className="form-control" placeholder="Juan Pérez" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cuenta</button>
      </form>
    );
  };
  
  export default CuentaForm;
  