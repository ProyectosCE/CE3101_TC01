import Head from "next/head";
import { useRouter } from "next/router";
import ClientLayout from "@/components/client/ClientLayout";
import CreditCardTransactionList from "@/components/CreditCardTransactionList";

interface CreditCard {
  number: string;
  currency: "Colones" | "Dolares";
  limit: number;
  minPayment: number;
  cutoffDate: string;
  paymentDate: string;
}

interface Transaction {
  name: string;
  amount: number;
}

export default function CardTransactionsPage() {
  const router = useRouter();
  const { cardNumber } = router.query;

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  const card: CreditCard = {
    number: cardNumber as string,
    currency: "Dolares",
    limit: 5000,
    minPayment: 100,
    cutoffDate: "2023-10-15",
    paymentDate: "2023-10-30",
  };

  const transactions: Transaction[] = [
    { name: "Compra en Supermercado", amount: -50 },
    { name: "Pago de Servicios", amount: -100 },
    { name: "Devolución", amount: 20 },
  ];

  const handleBack = () => {
    router.push("/client/tarjetas");
  };

  return (
    <>
      <Head>
        <title>Transacciones - Tarjeta {card.number}</title>
        <meta name="description" content="Consulta las transacciones de tu tarjeta de crédito." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <CreditCardTransactionList card={card} transactions={transactions} onBack={handleBack} />
      </ClientLayout>
    </>
  );
}
