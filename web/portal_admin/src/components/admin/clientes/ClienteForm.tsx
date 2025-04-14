/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: ClienteForm
 * Formulario para registrar o editar la información de un cliente.
 *
 * Props:
 * - Ninguna (el formulario es estático y no recibe props en esta versión).
 *
 * Example:
 * <ClienteForm />
 */

import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config/api';

type Cliente = {
  tipo_id: string;
  cedula: string;
  direccion: string;
  telefono: string;
  ingreso_mensual: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
};

type ClienteFormProps = {
  onSubmit: () => void;
  editingCliente: Cliente | null; // Add editingCliente prop
};

const ClienteForm = ({ onSubmit, editingCliente }: ClienteFormProps) => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Cliente>({
    tipo_id: 'FISICO',
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

  useEffect(() => {
    if (editingCliente) {
      setFormData(editingCliente); // Populate form with client data
    } else {
      setFormData({
        tipo_id: 'FISICO',
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
    }
  }, [editingCliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tipo = editingCliente ? 'editar' : 'nuevo'; // Determine action type
    const apiUrl = `${API_ENDPOINT}Clientes?tipo=${tipo}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPopupMessage(editingCliente ? 'Cliente actualizado exitosamente.' : 'Cliente añadido exitosamente.');
        onSubmit(); // Notify parent component
      } else {
        setPopupMessage('Error al procesar la solicitud. Inténtelo de nuevo.');
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
          {editingCliente ? 'Actualizar Cliente' : 'Guardar Cliente'}
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
