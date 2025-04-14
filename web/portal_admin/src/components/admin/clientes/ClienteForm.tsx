import { useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

type ClienteFormProps = {
  onSubmit: () => void; // Define the type for the onSubmit prop
};

const ClienteForm = ({ onSubmit }: ClienteFormProps) => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id_cliente: 0, // Immutable
    tipo_id: 'FISICO', // Immutable
    cedula: '',
    direccion: '',
    telefono: '',
    ingreso_mensual: 0,
    usuario: '',
    password: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_ENDPOINT}Clientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPopupMessage('Cliente añadido exitosamente.');
      } else {
        setPopupMessage('Error al añadir el cliente. Inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Error al conectar con el servidor.');
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
    window.location.reload(); // Reload the page directly
  };

  return (
    <div className="container mx-auto" style={{ maxWidth: '800px' }}>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Número de Cédula</label>
            <input
              type="text"
              name="cedula"
              className="form-control"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="123456789"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Primer Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Primer Apellido</label>
            <input
              type="text"
              name="apellido1"
              className="form-control"
              value={formData.apellido1}
              onChange={handleChange}
              placeholder="Pérez"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Segundo Apellido</label>
            <input
              type="text"
              name="apellido2"
              className="form-control"
              value={formData.apellido2}
              onChange={handleChange}
              placeholder="Gómez"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Dirección Exacta</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle 123, Casa 45"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="8888-8888"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Ingreso mensual</label>
            <input
              type="number"
              name="ingreso_mensual"
              className="form-control"
              value={formData.ingreso_mensual}
              onChange={handleChange}
              placeholder="₡0.00"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              name="usuario"
              className="form-control"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="usuario123"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cliente
        </button>
      </form>

      {popupMessage && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button className="btn btn-primary" onClick={handlePopupClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteForm;
