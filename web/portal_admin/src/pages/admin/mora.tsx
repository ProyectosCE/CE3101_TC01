import AdminLayout from '@/components/admin/AdminLayout';
import ReporteMoraTable from '@/components/admin/mora/ReporteMoraTable';

const MoraPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Mora</h2>
      <ReporteMoraTable />
    </AdminLayout>
  );
};

export default MoraPage;
