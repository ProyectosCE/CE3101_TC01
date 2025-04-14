import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AsesorForm from '@/components/admin/asesores/AsesorForm';
import AsesorTable from '@/components/admin/asesores/AsesorTable';
import { API_ENDPOINT } from '@/config/api';

interface Asesor {
  id_asesor?: number; // Changed to optional
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  monto_meta: number;
  id_rol: string;
}

const AsesoresPage = () => {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [editingAsesor, setEditingAsesor] = useState<Asesor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsesores = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Asesor`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Asesor[] = await response.json();
        setAsesores(data);
      } catch (error) {
        console.error('Error fetching asesores:', error);
        setError('Error al cargar los datos de los asesores.');
      }
    };

    fetchAsesores();
  }, []);

  const handleAddAsesor = (asesor: Asesor) => {
    setAsesores([...asesores, asesor]);
  };

  const handleDeleteAsesor = async (asesor: Asesor) => {
    const apiUrl = `${API_ENDPOINT}Asesor?tipo=borrar`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asesor), // Send the entire asesor object
      });

      if (response.ok) {
        window.location.reload(); // Reload the page on success
      } else {
        console.error('Error deleting asesor:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditAsesor = (asesor: Asesor) => {
    setEditingAsesor(asesor);
  };

  const handleUpdateAsesor = (updatedAsesor: Asesor) => {
    setAsesores(asesores.map((a) => (a.id_asesor === updatedAsesor.id_asesor ? updatedAsesor : a)));
    setEditingAsesor(null);
  };

  return (
    <AdminLayout>
      <h2>Gestión de Asesores de Crédito</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <AsesorForm
        onAddAsesor={handleAddAsesor}
        onUpdateAsesor={handleUpdateAsesor}
        editingAsesor={editingAsesor}
      />
      <AsesorTable
        asesores={asesores}
        onDeleteAsesor={handleDeleteAsesor} // Pass the updated function
        onEditAsesor={handleEditAsesor}
      />
    </AdminLayout>
  );
};

export default AsesoresPage;
