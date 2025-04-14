/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Page: AccountList
 * Página para mostrar la lista de cuentas del cliente y permitir seleccionar una para ver detalles.
 *
 * Props:
 * - accounts: Lista de cuentas a mostrar.
 *
 * Example:
 * <AccountList accounts={accounts} />
 */

import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Account {
  number: string;
  currency: "Colones" | "Dolares";
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
}

export default function AccountList({ accounts = [] }: AccountListProps) {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      router.back();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div>
      <h1 className={styles.title}>Cuentas</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número de Cuenta</th>
            <th>Moneda</th>
            <th>Monto Disponible</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.number} onClick={() => router.push(`/account/${account.number}`)}>
              <td>{account.number}</td>
              <td>{account.currency}</td>
              <td>{account.currency === "Colones" ? `₡${account.balance}` : `$${account.balance}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className={styles.backButton} onClick={() => router.back()}>
        Volver
      </Button>
    </div>
  );
}

// Add static props to provide default data
export async function getStaticProps() {
  return {
    props: {
      accounts: [] // Default empty array
    },
  };
}
