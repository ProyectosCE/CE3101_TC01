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
 * Component: AccountList
 * Muestra una tabla con las cuentas del cliente y permite seleccionar una para ver detalles.
 *
 * Props:
 * - accounts: Lista de cuentas.
 * - onAccountClick: Función a ejecutar al seleccionar una cuenta.
 *
 * Example:
 * <AccountList accounts={accounts} onAccountClick={fn} />
 */

import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";

interface Account {
  number: string;
  currency: string;
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
  onAccountClick: (account: Account) => void;
}

export default function AccountList({ accounts, onAccountClick }: AccountListProps) {
  const router = useRouter();

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
            <tr key={account.number} onClick={() => onAccountClick(account)}>
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
