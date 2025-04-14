import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";

export default function TransactionList({ account, transactions, handleBack }) {
  const router = useRouter();

  return (
    <div>
      <h1 className={styles.title}>Transacciones - Cuenta {account.number}</h1>
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
          {transactions.map((transaction, index) => (
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
      <Button className={styles.backButton} onClick={() => router.back()}>
        Volver
      </Button>
    </div>
  );
}
