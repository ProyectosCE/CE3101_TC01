const TarjetaTable = () => {
    return (
      <div>
        <h5>Tarjetas registradas</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Expira</th>
              <th>Saldo/Crédito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1234-5678-9012-3456</td>
              <td>Débito</td>
              <td>12/2026</td>
              <td>₡150,000.00</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
            <tr>
              <td>4321-8765-2109-6543</td>
              <td>Crédito</td>
              <td>08/2025</td>
              <td>₡0.00</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TarjetaTable;
  