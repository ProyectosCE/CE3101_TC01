import { useState } from 'react';

const MovimientosTable = () => {
  const [filtro, setFiltro] = useState('Todos');

  const movimientos = [
    { tipo: 'Depósito', cuenta: '000-123456-01', monto: 100000, fecha: '2025-03-20' },
    { tipo: 'Compra', tarjeta: '1234-5678-9012-3456', monto: 15000, fecha: '2025-03-22' },
    { tipo: 'Transferencia', cuenta: '000-123456-02', monto: -30000, fecha: '2025-03-23' },
    { tipo: 'Pago Préstamo', cuenta: '000-123456-01', monto: -50000, fecha: '2025-03-24' },
  ];

  const filtrados = filtro === 'Todos' ? movimientos : movimientos.filter(m => m.tipo === filtro);

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Filtrar por tipo de movimiento:</label>
        <select className="form-select w-auto" value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option>Todos</option>
          <option>Depósito</option>
          <option>Compra</option>
          <option>Transferencia</option>
          <option>Pago Préstamo</option>
        </select>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Tipo</th>
            <th>Cuenta/Tarjeta</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((mov, idx) => (
            <tr key={idx}>
              <td>{mov.tipo}</td>
              <td>{mov.cuenta || mov.tarjeta}</td>
              <td className={mov.monto < 0 ? 'text-danger' : 'text-success'}>
                {mov.monto < 0 ? `-₡${Math.abs(mov.monto).toLocaleString()}` : `₡${mov.monto.toLocaleString()}`}
              </td>
              <td>{mov.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovimientosTable;
