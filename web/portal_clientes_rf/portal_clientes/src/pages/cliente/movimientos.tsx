import ClienteLayout from '@/components/cliente/ClienteLayout';
import MovimientosTable from '@/components/cliente/movimientos/MovimientosTable';

export default function MovimientosPage() {
  return (
    <ClienteLayout>
      <h2>Historial de Movimientos</h2>
      <MovimientosTable />
    </ClienteLayout>
  );
}
