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
 * Component: CreditCardTransactionList
 * Muestra la lista de transacciones de una tarjeta de crédito y detalles de la tarjeta.
 *
 * Props:
 * - card: Objeto tarjeta de crédito.
 * - transactions: Lista de transacciones de la tarjeta.
 * - onBack: Función para volver a la pantalla anterior.
 *
 * Example:
 * <CreditCardTransactionList card={card} transactions={txs} onBack={fn} />
 */

import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";

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

interface CreditCardTransactionListProps {
  card: CreditCard;
  transactions: Transaction[];
  onBack: () => void;
}

export default function CreditCardTransactionList({ card, transactions, onBack }: CreditCardTransactionListProps) {
  const router = useRouter();
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleBack = () => {
    onBack();
  };

  return (
    <div>
      <h1 className={styles.title}>Transacciones - Tarjeta ***** {card.number.slice(-4)}</h1>
      <div className={styles.cardDetails}>
        <p><strong>Monto Gastado:</strong> {card.currency === "Colones" ? `₡${totalSpent}` : `$${totalSpent}`}</p>
        <p><strong>Monto Total Disponible:</strong> {card.currency === "Colones" ? `₡${card.limit - totalSpent}` : `$${card.limit - totalSpent}`}</p>
        <p><strong>Cuota Mínima:</strong> {card.currency === "Colones" ? `₡${card.minPayment}` : `$${card.minPayment}`}</p>
        <p><strong>Fecha de Corte:</strong> {card.cutoffDate}</p>
        <p><strong>Fecha de Pago:</strong> {card.paymentDate}</p>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de Transacción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td
                style={{
                  color: transaction.amount < 0 ? "red" : "green",
                }}
              >
                {transaction.amount < 0 ? `${transaction.amount}` : `+${transaction.amount}`}
              </td>
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
