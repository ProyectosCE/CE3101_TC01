import React from "react";
import { Button, Table, Container } from "react-bootstrap";

export default function LoanDetails({ loan, payments, onBack }) {
  return (
    <Container>
      <h2>Detalles del Préstamo</h2>
      <p><strong>Fecha de Inicio:</strong> {loan.startDate}</p>
      <p><strong>Plazo:</strong> {loan.term} cuotas</p>
      <p><strong>Monto Original:</strong> ₡{loan.originalAmount}</p>
      <p><strong>Monto Saldado:</strong> ₡{loan.paidAmount}</p>
      <p><strong>Interés Anual:</strong> {loan.annualInterest}%</p>

      <h3>Historial de Pagos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Monto Saldado</th>
            <th>Deuda Anterior</th>
            <th>Deuda Actual</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.date}</td>
              <td>₡{payment.paidAmount}</td>
              <td>₡{payment.previousDebt}</td>
              <td>₡{payment.currentDebt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={onBack} className="mt-3">
        Volver
      </Button>
    </Container>
  );
}
