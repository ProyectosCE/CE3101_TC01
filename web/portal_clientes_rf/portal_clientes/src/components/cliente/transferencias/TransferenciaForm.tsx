import { useState } from 'react';

const TransferenciaForm = () => {
  const [tipo, setTipo] = useState<'cuenta' | 'sinpe'>('cuenta');
  const [mensaje, setMensaje] = useState('');

  const realizarTransferencia = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('✅ Transferencia realizada con éxito.');
  };

  return (
    <form onSubmit={realizarTransferencia}>
      <div className="mb-3">
        <label className="form-label">Cuenta de origen</label>
        <select className="form-select">
          <option value="000-123456-01">000-123456-01 (₡1.500.000)</option>
          <option value="000-123456-02">000-123456-02 ($2.300)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo de destino</label>
        <select className="form-select w-auto" onChange={e => setTipo(e.target.value as 'cuenta' | 'sinpe')}>
          <option value="cuenta">Cuenta Bancaria</option>
          <option value="sinpe">SINPE Móvil</option>
        </select>
      </div>

      {tipo === 'cuenta' ? (
        <div className="mb-3">
          <label className="form-label">Número de cuenta destino</label>
          <input type="text" className="form-control" placeholder="000-000000-00" required />
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label">Número de teléfono SINPE</label>
          <input type="tel" className="form-control" placeholder="8888-8888" required />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input type="number" className="form-control" placeholder="₡0.00" required />
      </div>

      <button type="submit" className="btn btn-primary">Realizar Transferencia</button>

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
    </form>
  );
};

export default TransferenciaForm;
