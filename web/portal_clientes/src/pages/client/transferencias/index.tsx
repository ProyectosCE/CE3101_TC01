import Head from "next/head";
import { useRouter } from "next/router";
import ClientLayout from "@/components/client/ClientLayout";
import TransactionOptions from "@/components/TransactionOptions";

export default function TransferenciasPage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(`/transferencias/${path}`);
  };

  return (
    <>
      <Head>
        <title>Transferencias - TECBANK</title>
        <meta name="description" content="Realiza transferencias de dinero de forma rápida y segura." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <TransactionOptions
          onBack={() => router.push("/client/")}
          onSinpe={() => router.push("/client/transferencias/sinpe")}
          onIban={() => router.push("/client/transferencias/iban")}
        />
      </ClientLayout>
    </>
  );
}
