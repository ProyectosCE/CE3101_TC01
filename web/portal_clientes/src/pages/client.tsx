import Head from "next/head";
import { SetStateAction, useState } from "react";
import styles from "@/styles/client.module.css";
import AccountList from "@/components/AccountList";
import TransactionList from "@/components/TransactionList";
import CreditCardList from "@/components/CreditCardList";
import CreditCardTransactionList from "@/components/CreditCardTransactionList";
import { Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Client() {
  const [view, setView] = useState("main"); // "main", "accounts", "transactions", "creditCards", "creditCardTransactions"
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const accounts = [
    { number: "123456789", currency: "Colones", balance: 500000 },
    { number: "987654321", currency: "Dólares", balance: 1200 },
  ];

  const transactions = [
    { name: "Compra Supermercado", type: "debito", date: "2023-10-01", time: "14:30", amount: -25000 },
    { name: "Pago Nómina", type: "credito", date: "2023-10-01", time: "09:00", amount: 500000 },
    { name: "Pago Servicios", type: "debito", date: "2023-09-30", time: "18:00", amount: -15000 },
  ];

  const creditCards = [
    {
      number: "1234567812345678",
      brand: "Visa",
      currency: "Colones",
      limit: 1000000,
      minPayment: 25000,
      cutoffDate: "2023-10-15",
      paymentDate: "2023-10-30",
    },
    {
      number: "8765432187654321",
      brand: "MasterCard",
      currency: "Dólares",
      limit: 2000,
      minPayment: 50,
      cutoffDate: "2023-10-10",
      paymentDate: "2023-10-25",
    },
  ];

  const creditCardTransactions = [
    { name: "Compra Electrónica", amount: -500 },
    { name: "Pago Mensual", amount: 1000 },
    { name: "Compra Ropa", amount: -200 },
  ];

  const handleAccountClick = (account: SetStateAction<null>) => {
    setSelectedAccount(account);
    setView("transactions");
  };

  const handleCardClick = (card: SetStateAction<null>) => {
    setSelectedCard(card);
    setView("creditCardTransactions");
  };

  return (
    <>
      <Head>
        <title>Client - TECBANK CLIENTES</title>
        <meta name="description" content="Client page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {view === "main" && (
          <>
            <h1 className={styles.title}>Portal de Clientes</h1>
            <Container>
              <Row className={styles.cardRow}>
                <Col md={4}>
                  <Card className={styles.card} onClick={() => setView("accounts")}>
                    <Card.Body>
                      <Card.Title>Cuentas</Card.Title>
                      <Card.Text>
                        Administra tus cuentas bancarias de forma rápida y segura.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className={styles.card} onClick={() => setView("creditCards")}>
                    <Card.Body>
                      <Card.Title>Tarjetas de Crédito</Card.Title>
                      <Card.Text>
                        Consulta y gestiona tus tarjetas de crédito fácilmente.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className={styles.card}>
                    <Card.Body>
                      <Card.Title>Préstamos</Card.Title>
                      <Card.Text>
                        Revisa el estado de tus préstamos y realiza pagos en línea.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
        {view === "accounts" && (
          <AccountList
            accounts={accounts}
            onAccountClick={handleAccountClick}
            onBack={() => setView("main")}
          />
        )}
        {view === "transactions" && selectedAccount && (
          <TransactionList
            account={selectedAccount}
            transactions={transactions}
            onBack={() => setView("accounts")}
          />
        )}
        {view === "creditCards" && (
          <CreditCardList
            creditCards={creditCards}
            onCardClick={handleCardClick}
            onBack={() => setView("main")}
          />
        )}
        {view === "creditCardTransactions" && selectedCard && (
          <CreditCardTransactionList
            card={selectedCard}
            transactions={creditCardTransactions}
            onBack={() => setView("creditCards")}
          />
        )}
      </div>
    </>
  );
}
