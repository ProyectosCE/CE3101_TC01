const SaldoResumen = () => {
    const cuentas = [
      { numero: '000-123456-01', tipo: 'Ahorros', moneda: 'Colones', saldo: 1500000 },
      { numero: '000-123456-02', tipo: 'Corriente', moneda: 'Dólares', saldo: 2300 },
    ];
  
    const tarjetas = [
      { numero: '1234-5678-9012-3456', tipo: 'Débito', saldo: 150000 },
      { numero: '4321-8765-2109-6543', tipo: 'Crédito', saldo: 40000 },
    ];
  
    return (
      <div className="row">
        <div className="col-md-6">
          <h5>Cuentas Bancarias</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Moneda</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.numero}</td>
                  <td>{c.tipo}</td>
                  <td>{c.moneda}</td>
                  <td>{c.moneda === 'Colones' ? `₡${c.saldo.toLocaleString()}` : `$${c.saldo.toLocaleString()}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="col-md-6">
          <h5>Tarjetas</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Saldo Disponible</th>
              </tr>
            </thead>
            <tbody>
              {tarjetas.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.numero}</td>
                  <td>{t.tipo}</td>
                  <td>₡{t.saldo.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default SaldoResumen;
  