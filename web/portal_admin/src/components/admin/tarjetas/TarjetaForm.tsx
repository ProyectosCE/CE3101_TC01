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
 * Component: TarjetaForm
 * Formulario para registrar o editar la información de una tarjeta (débito o crédito).
 *
 * Props:
 * - Ninguna (el formulario es estático y no recibe props en esta versión).
 *
 * Example:
 * <TarjetaForm />
 */

import { useState } from "react";

const TarjetaForm = () => {
    const [tipoTarjeta, setTipoTarjeta] = useState("Débito");

    const handleTipoTarjetaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoTarjeta(event.target.value);
    };

    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de tarjeta</label>
            <select className="form-select" value={tipoTarjeta} onChange={handleTipoTarjetaChange}>
              <option>Débito</option>
              <option>Crédito</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Marca de tarjeta</label>
            <select className="form-select">
              <option>Visa</option>
              <option>MasterCard</option>
              <option>American Express</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Identificación del Cliente</label>
            <input type="text" className="form-control" placeholder="123456789" />
          </div>
          {tipoTarjeta === "Débito" && (
            <div className="col-md-6 mb-3">
              <label className="form-label">Número de cuenta</label>
              <input type="text" className="form-control" placeholder="000-1234567890" />
            </div>
          )}
          {tipoTarjeta === "Crédito" && (
            <div className="col-md-6 mb-3">
              <label className="form-label">Límite de crédito</label>
              <input type="number" className="form-control" placeholder="₡0.00" />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Guardar Tarjeta</button>
      </form>
    );
  };

export default TarjetaForm;
