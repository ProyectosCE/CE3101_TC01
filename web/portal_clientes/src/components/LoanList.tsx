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
  * Component: LoanList
  * Lista de préstamos del cliente, permite seleccionar uno para ver detalles.
  *
  * Props:
  * - loans: Lista de préstamos.
  * - onLoanClick: Función a ejecutar al seleccionar un préstamo.
  * - onBack: Función para volver a la pantalla anterior.
  *
  * Example:
  * <LoanList loans={loans} onLoanClick={fn} onBack={fn} />
  */

import React from "react";
import { Button, ListGroup, Container } from "react-bootstrap";

interface Loan {
  id: string;
  number: string;
  type: string;
}

interface LoanListProps {
  loans: Loan[];
  onLoanClick: (loan: Loan) => void;
  onBack: () => void;
}

export default function LoanList({ loans, onLoanClick, onBack }: LoanListProps) {
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
