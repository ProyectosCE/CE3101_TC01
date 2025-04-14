import { useState } from 'react';

const PagoTarjetaForm = () => {
  const [mensaje, setMensaje] = useState('');

  const pagarTarjeta = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('✅ Pago realizado exitosamente.');
  };

  return (
    <form onSubmit={pagarTarjeta}>
      <div className="mb-3">
        <label className="form-label">Seleccionar tarjeta de crédito</label>
        <select className="form-select">
          <option>4321-8765-2109-6543 (Deuda: ₡40.000)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Cuenta a debitar</label>
        <select className="form-select">
          <option>000-123456-01 (₡1.500.000)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Monto a abonar</label>
        <input type="number" className="form-control" placeholder="₡0.00" required />
      </div>

      <button type="submit" className="btn btn-primary">Realizar Pago</button>

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
    </form>
  );
};

export default PagoTarjetaForm;
