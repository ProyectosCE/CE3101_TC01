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
 * Component: CuentaForm
 * Formulario para registrar o editar la información de una cuenta bancaria.
 *
 * Props:
 * - Ninguna (el formulario es estático y no recibe props en esta versión).
 *
 * Example:
 * <CuentaForm />
 */

const CuentaForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-control" placeholder="Cuenta de ahorro personal" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Moneda</label>
            <select className="form-select">
              <option>Colones</option>
              <option>Dólares</option>
              <option>Euros</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Tipo de cuenta</label>
            <select className="form-select">
              <option>Ahorros</option>
              <option>Corriente</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Identificación del Cliente</label>
            <input type="text" className="form-control" placeholder="123456789" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cuenta</button>
      </form>
    );
  };
  
  export default CuentaForm;
