import React from "react";
import { Button, ListGroup, Container } from "react-bootstrap";

export default function LoanList({ loans, onLoanClick, onBack }) {
  return (
    <Container>
      <h2>Listado de Préstamos</h2>
      <ListGroup>
        {loans.map((loan) => (
          <ListGroup.Item key={loan.id} onClick={() => onLoanClick(loan)} action>
            <strong>Número:</strong> {loan.number} <br />
            <strong>Tipo:</strong> {loan.type}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="secondary" onClick={onBack} className="mt-3">
        Volver
      </Button>
    </Container>
  );
}
