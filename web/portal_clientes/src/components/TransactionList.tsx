import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { API_ENDPOINT } from "@/config/api";

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
 * Component: TransactionList
 * Muestra la lista de transacciones asociadas a una cuenta específica.
 *
 * Props:
 * - account: Objeto cuenta seleccionada.
 * - transactions: Lista de transacciones de la cuenta.
 * - handleBack: Función para volver a la pantalla anterior.
 *
 * Example:
 * <TransactionList account={account} transactions={txs} handleBack={fn} />
 */

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
}

interface AccountCard {
  numero_tarjeta: string;
  marca: string;
}

interface TransactionListProps {
  account: Account;
  transactions: Transaction[];
  handleBack: () => void;
}

export default function TransactionList({ account, transactions, handleBack }: TransactionListProps) {
  const [showCards, setShowCards] = useState(false);
  const [cards, setCards] = useState<AccountCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}Tarjeta/tarjetas/${account.number}`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setCards(data);
      setShowCards(true);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === "Colones" ? "₡" : "$";
  };

  return (
    <div>
      <div className={styles.accountHeader}>
        <h1 className={styles.title}>Transacciones - Cuenta {account.number}</h1>
        <div className={styles.accountInfo}>
          <span className={styles.currency}>
            {account.currency} - {getCurrencySymbol(account.currency)}
            {account.balance.toLocaleString()}
          </span>
          <Button
            variant="outline-primary"
            className={styles.cardButton}
            onClick={fetchCards}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Mostrar tarjetas'}
          </Button>
        </div>
        {showCards && cards.length > 0 && (
          <div className={styles.cardsList}>
            <h4>Tarjetas asociadas:</h4>
            <ul>
              {cards.map((card, index) => (
                <li key={index}>
                  {card.marca} - **** **** **** {card.numero_tarjeta.slice(-4)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de Transacción</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {(!transactions || transactions.length === 0) && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay transacciones para mostrar
              </td>
            </tr>
          )}
          {transactions &&
            transactions.length > 0 &&
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.name}</td>
                <td>{transaction.type === "credito" ? "Crédito" : "Débito"}</td>
                <td>{transaction.date}</td>
                <td>{transaction.time}</td>
                <td
                  style={{
                    color: transaction.type === "credito" ? "green" : "red",
                  }}
                >
                  {transaction.type === "credito" ? `+${transaction.amount}` : `${transaction.amount}`}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Button className={styles.backButton} onClick={handleBack}>
        Volver
      </Button>
    </div>
  );
}
