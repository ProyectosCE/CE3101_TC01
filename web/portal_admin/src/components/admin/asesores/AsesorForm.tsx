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
 * Component: AsesorForm
 * Formulario para registrar o editar la información de un asesor.
 *
 * Props:
 * - Ninguna (el formulario es estático y no recibe props en esta versión).
 *
 * Example:
 * <AsesorForm />
 */

const AsesorForm = () => {
    return (
      <form className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre completo</label>
            <input type="text" className="form-control" placeholder="Carlos Rodríguez" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cédula</label>
            <input type="text" className="form-control" placeholder="123456789" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Meta en colones</label>
            <input type="number" className="form-control" placeholder="₡0.00" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Meta en dólares</label>
            <input type="number" className="form-control" placeholder="$0.00" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Guardar Asesor</button>
      </form>
    );
  };
  
  export default AsesorForm;
