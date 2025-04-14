const PrestamoTable = () => {
    return (
      <div>
        <h5>Préstamos registrados</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Saldo</th>
              <th>Interés</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>₡1,500,000</td>
              <td>₡1,200,000</td>
              <td>10%</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Pago Normal</button>
                <button className="btn btn-sm btn-outline-warning me-2">Pago Extraordinario</button>
                <button className="btn btn-sm btn-outline-info">Recalcular</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default PrestamoTable;
  