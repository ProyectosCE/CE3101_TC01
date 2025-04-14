import ClienteLayout from '@/components/cliente/ClienteLayout';
import SaldoResumen from '@/components/cliente/saldos/SaldoResumen';

export default function SaldosPage() {
  return (
    <ClienteLayout>
      <h2>Consulta de Saldos</h2>
      <SaldoResumen />
    </ClienteLayout>
  );
}
