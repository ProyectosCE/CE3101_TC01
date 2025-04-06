import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function AccountList({ accounts, onAccountClick, onBack }) {
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
      <Button className={styles.backButton} onClick={onBack}>
        Volver
      </Button>
    </div>
  );
}
