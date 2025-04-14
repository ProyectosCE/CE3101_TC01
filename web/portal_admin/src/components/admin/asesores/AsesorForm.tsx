import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

interface Asesor {
  id_asesor?: number;
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  monto_meta: number;
  id_rol: string;
}

interface AsesorFormProps {
  onAddAsesor: (asesor: Asesor) => void;
  onUpdateAsesor: (asesor: Asesor) => void;
  editingAsesor: Asesor | null;
}

const AsesorForm = ({ onAddAsesor, onUpdateAsesor, editingAsesor }: AsesorFormProps) => {
  const [formData, setFormData] = useState<Asesor>({
    nombre: '',
    cedula: '',
    fecha_nacimiento: '',
    monto_meta: 0,
    id_rol: '',
  });

  useEffect(() => {
    if (editingAsesor) {
      setFormData(editingAsesor);
    } else {
      setFormData({
        nombre: '',
        cedula: '',
        fecha_nacimiento: '',
        monto_meta: 0,
        id_rol: '',
      });
    }
  }, [editingAsesor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tipo = editingAsesor ? 'editar' : 'nuevo';
    const apiUrl = `${API_ENDPOINT}Asesor?tipo=${tipo}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.reload(); // Reload the page on success
      } else {
        console.error('Error saving asesor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Carlos Rodríguez"
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Cédula</label>
          <input
            type="text"
            className="form-control"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="123456789"
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Meta en colones</label>
          <input
            type="number"
            className="form-control"
            name="monto_meta"
            value={formData.monto_meta}
            onChange={handleChange}
            placeholder="₡0.00"
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Rol</label>
          <input
            type="text"
            className="form-control"
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            placeholder="Rol del asesor"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        {editingAsesor ? 'Actualizar Asesor' : 'Guardar Asesor'}
      </button>
    </form>
  );
};

export default AsesorForm;
