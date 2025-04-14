import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CreditCardList({ creditCards }) {
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
      <h1 className={styles.title}>Tarjetas de Crédito</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Marca</th>
          </tr>
        </thead>
        <tbody>
          {creditCards.map((card) => (
            <tr key={card.number} onClick={() => router.push(`/credit-card/${card.number}`)}>
              <td>***** {card.number.slice(-4)}</td>
              <td>{card.brand}</td>
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
