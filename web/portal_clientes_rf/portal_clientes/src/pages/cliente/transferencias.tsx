import ClienteLayout from '@/components/cliente/ClienteLayout';
import TransferenciaForm from '@/components/cliente/transferencias/TransferenciaForm';

export default function TransferenciasPage() {
  return (
    <ClienteLayout>
      <h2>Transferencias</h2>
      <TransferenciaForm />
    </ClienteLayout>
  );
}
