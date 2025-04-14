import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CreditCardListProps } from "@/interfaces/creditCard";

const CreditCardList: React.FC<CreditCardListProps> = ({ creditCards, onCardClick }) => {
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

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1 className={styles.title}>Tarjetas de Crédito</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Marca</th>
            <th>Numero Cuenta</th>
          </tr>
        </thead>
        <tbody>
          {creditCards.map((card) => (
            <tr key={card.number} onClick={() => onCardClick(card.number)}>
              <td>***** {card.number.slice(-4)}</td>
              <td>{card.brand}</td>
              <td>{card.accountNumber}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className={styles.backButton} onClick={() => router.back()}>
        Volver
      </Button>
    </div>
  );
};

export default CreditCardList;
