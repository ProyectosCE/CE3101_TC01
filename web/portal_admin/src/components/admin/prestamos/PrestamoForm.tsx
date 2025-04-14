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
 * Component: PrestamoForm
 * Formulario para registrar o editar la información de un préstamo.
 *
 * Props:
 * - Ninguna (el formulario es estático y no recibe props en esta versión).
 *
 * Example:
 * <PrestamoForm />
 */

const PrestamoForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Cédula de Cliente</label>
            <input type="number" className="form-control" placeholder="123456789" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Monto del préstamo</label>
            <input type="number" className="form-control" placeholder="₡0.00" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Tasa de interés (%)</label>
            <input type="number" className="form-control" placeholder="10.5" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Préstamo</button>
      </form>
    );
  };
  
  export default PrestamoForm;
