const CuentaTable = () => {
    return (
      <div>
        <h5>Cuentas registradas</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Número</th>
              <th>Descripción</th>
              <th>Moneda</th>
              <th>Tipo</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>000-1234567890</td>
              <td>Cuenta Ahorros Principal</td>
              <td>Colones</td>
              <td>Ahorros</td>
              <td>Juan Pérez</td>
              <td>
                <button className="btn btn-sm btn-outline-success me-2">Depósito</button>
                <button className="btn btn-sm btn-outline-warning me-2">Retiro</button>
                <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CuentaTable;
  