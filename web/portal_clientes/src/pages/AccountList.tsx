import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AccountList({ accounts }) {
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
