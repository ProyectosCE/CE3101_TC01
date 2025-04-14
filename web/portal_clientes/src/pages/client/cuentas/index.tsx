import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ClientLayout from "@/components/client/ClientLayout";
import AccountList from "@/components/AccountList";
import { Cuenta } from "@/interfaces/cuenta";
import { API_ENDPOINT } from "@/config/api";
import { useAuthStore } from "@/stores/authStore";

interface Account {
  number: string;
  currency: string;
  balance: number;
}

export default function AccountListPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Cuenta[]>([]);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!userInfo?.cedula) return;
      try {
        const response = await fetch(
          `${API_ENDPOINT}Cuenta/Cuentas?cedula=${userInfo.cedula}`
        );
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [userInfo?.cedula]);

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  const handleAccountClick = (account: Account) => {
    router.push(`/client/cuentas/transactions?accountNumber=${account.number}`);
  };

  const mappedAccounts = accounts.map((account) => ({
    number: account.numero_cuenta.toString(),
    currency: account.id_moneda === "COLON" ? "Colones" : "Dólares",
    balance: account.monto,
  }));

  return (
    <>
      <Head>
        <title>Cuentas - TECBANK</title>
        <meta
          name="description"
          content="Administra tus cuentas bancarias de forma rápida y segura."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <AccountList
          accounts={mappedAccounts}
          onAccountClick={handleAccountClick}
        />
      </ClientLayout>
    </>
  );
}
