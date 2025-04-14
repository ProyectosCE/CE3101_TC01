import { useState } from 'react';

const PrestamoPagoForm = () => {
  const [tipoPago, setTipoPago] = useState<'normal' | 'extraordinario'>('normal');
  const [mensaje, setMensaje] = useState('');

  const realizarPago = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('✅ Pago procesado exitosamente.');
  };

  return (
    <form onSubmit={realizarPago}>
      <div className="mb-3">
        <label className="form-label">Seleccionar préstamo</label>
        <select className="form-select">
          <option>Préstamo #001-456 (₡2.500.000 saldo)</option>
          <option>Préstamo #002-789 (₡1.200.000 saldo)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo de pago</label>
        <select className="form-select w-auto" onChange={e => setTipoPago(e.target.value as 'normal' | 'extraordinario')}>
          <option value="normal">Pago de cuota</option>
          <option value="extraordinario">Pago extraordinario</option>
        </select>
      </div>

      {tipoPago === 'normal' && (
        <div className="mb-3">
          <label className="form-label">Cuota a pagar</label>
          <select className="form-select">
            <option>Cuota #5 - ₡50.000</option>
            <option>Cuota #6 - ₡50.000</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Cuenta a debitar</label>
        <select className="form-select">
          <option>000-123456-01 (₡1.500.000)</option>
        </select>
      </div>

      {tipoPago === 'extraordinario' && (
        <div className="mb-3">
          <label className="form-label">Monto a abonar</label>
          <input type="number" className="form-control" placeholder="₡0.00" required />
        </div>
      )}

      <button type="submit" className="btn btn-primary">Pagar</button>

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
    </form>
  );
};

export default PrestamoPagoForm;
