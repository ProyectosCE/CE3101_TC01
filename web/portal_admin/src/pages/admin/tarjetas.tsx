import AdminLayout from '@/components/admin/AdminLayout';
import TarjetaForm from '@/components/admin/tarjetas/TarjetaForm';
import TarjetaTable from '@/components/admin/tarjetas/TarjetaTable';

const TarjetasPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Tarjetas</h2>
      <TarjetaForm />
      <TarjetaTable />
    </AdminLayout>
  );
};

export default TarjetasPage;
