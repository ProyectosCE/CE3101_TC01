import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function CreditCardList({ creditCards, onCardClick, onBack }) {
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
            <tr key={card.number} onClick={() => onCardClick(card)}>
              <td>***** {card.number.slice(-4)}</td>
              <td>{card.brand}</td>
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
