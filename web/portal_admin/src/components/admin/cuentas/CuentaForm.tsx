import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config/api';

export interface Cuenta {
  numero_cuenta?: number;
  descripcion: string;
  id_moneda: string;
  id_tipo_cuenta: string;
  cedula: number;
}

const CuentaForm = ({ cuenta, onSubmit }: { cuenta: Cuenta | null; onSubmit: () => void }) => {
  const [formData, setFormData] = useState<Cuenta>({
    descripcion: '',
    id_moneda: '',
    id_tipo_cuenta: '',
    cedula: 0,
  });

  useEffect(() => {
    if (cuenta) {
      setFormData(cuenta);
    }
  }, [cuenta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tipo = cuenta ? 'editar' : 'nuevo';
    try {
      const response = await fetch(`${API_ENDPOINT}Cuenta/agregarCuenta?tipo=${tipo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.location.reload(); // Reload the page on success
      } else {
        console.error('Error saving cuenta');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Cuenta de ahorro personal"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Moneda</label>
          <select
            className="form-select"
            name="id_moneda"
            value={formData.id_moneda}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="COLON">Colones</option>
            <option value="DOLAR">Dólares</option>
            <option value="EURO">Euros</option>
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Tipo de cuenta</label>
          <select
            className="form-select"
            name="id_tipo_cuenta"
            value={formData.id_tipo_cuenta}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="AHORROS">Ahorros</option>
            <option value="CORRIENTE">Corriente</option>
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Identificación del Cliente</label>
          <input
            type="text"
            className="form-control"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="123456789"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        {cuenta ? 'Actualizar Cuenta' : 'Guardar Cuenta'}
      </button>
    </form>
  );
};

export default CuentaForm;
