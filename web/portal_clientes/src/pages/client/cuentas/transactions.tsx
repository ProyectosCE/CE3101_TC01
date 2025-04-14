import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ClientLayout from "@/components/client/ClientLayout";
import TransactionList from "@/components/TransactionList";
import { Transaccion } from "@/interfaces/transaccion";
import { API_ENDPOINT } from "@/config/api";
import { ICuenta } from "@/interfaces/cuenta";

interface Transaction {
  name: string;
  type: string;
  date: string;
  time: string;
  amount: number;
}

interface Account {
  number: string;
  currency: string;
  balance: number;
  description: string;
  accountType: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { accountNumber } = router.query;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<Account>({
    number: "",
    currency: "Colones",
    balance: 0,
    description: "",
    accountType: "",
  });

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!accountNumber) return;
      try {
        const response = await fetch(
          `${API_ENDPOINT}Cuenta/cuentaInfo/${accountNumber}`
        );
        const text = await response.text();

        if (!text) {
          console.error("Empty response from server");
          return;
        }

        try {
          const data = JSON.parse(text);
          if (data && data.numero_cuenta) {
            setAccount({
              number: data.numero_cuenta.toString(),
              currency: data.id_moneda === "COLON" ? "Colones" : "Dólares",
              balance: data.monto,
              description: data.descripcion,
              accountType: data.id_tipo_cuenta,
            });
          }
        } catch (parseError) {
          console.error("Error parsing account data:", parseError);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [accountNumber]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountNumber) return;
      try {
        const response = await fetch(
          `${API_ENDPOINT}Transaccion/transacciones/${accountNumber}`
        );
        const text = await response.text();
        const data: Transaccion[] = text ? JSON.parse(text) : [];

        const mappedTransactions = data.map((t) => ({
          name: t.descripcion,
          type: t.id_tipo_transaccion.toLowerCase(),
          date: new Date(t.fecha_hora).toLocaleDateString(),
          time: new Date(t.fecha_hora).toLocaleTimeString(),
          amount:
            t.id_tipo_transaccion === "RETIRO" ||
            t.id_tipo_transaccion === "COMPRA"
              ? -t.monto
              : t.monto,
        }));

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [accountNumber]);

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  return (
    <>
      <Head>
        <title>Transacciones - TECBANK</title>
        <meta
          name="description"
          content="Consulta las transacciones de tu cuenta."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <TransactionList
          account={account}
          transactions={transactions}
          handleBack={() => router.push("/client/cuentas")}
        />
      </ClientLayout>
    </>
  );
}
