const ReporteMoraTable = () => {
    return (
      <div>
        <button className="btn btn-outline-info mb-3">Generar Reporte</button>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Cliente</th>
              <th>Cédula</th>
              <th>Préstamo</th>
              <th>Cuotas vencidas</th>
              <th>Monto adeudado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>123456789</td>
              <td>#001-987654</td>
              <td>2</td>
              <td>₡75,000.00</td>
            </tr>
            <tr>
              <td>Ana Ramírez</td>
              <td>456789123</td>
              <td>#001-123456</td>
              <td>1</td>
              <td>₡42,500.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ReporteMoraTable;
  