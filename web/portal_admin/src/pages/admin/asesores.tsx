import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AsesorForm from '@/components/admin/asesores/AsesorForm';
import AsesorTable from '@/components/admin/asesores/AsesorTable';
import { API_ENDPOINT } from '@/config/api';

interface Asesor {
  id_asesor: number;
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  monto_meta: number;
  id_rol: string;
}

const AsesoresPage = () => {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
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

  return (
    <AdminLayout>
      <h2>Gestión de Asesores de Crédito</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <AsesorForm />
      <AsesorTable asesores={asesores} />
    </AdminLayout>
  );
};

export default AsesoresPage;
