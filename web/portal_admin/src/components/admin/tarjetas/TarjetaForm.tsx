const TarjetaForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Número de tarjeta</label>
            <input type="text" className="form-control" placeholder="XXXX-XXXX-XXXX-1234" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de tarjeta</label>
            <select className="form-select">
              <option>Débito</option>
              <option>Crédito</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Fecha de expiración</label>
            <input type="month" className="form-control" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Código de seguridad</label>
            <input type="text" className="form-control" placeholder="123" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Saldo / Crédito disponible</label>
            <input type="number" className="form-control" placeholder="₡0.00" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Tarjeta</button>
      </form>
    );
  };
  
  export default TarjetaForm;
  