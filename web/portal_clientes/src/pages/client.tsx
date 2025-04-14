import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/client.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faCreditCard, faHandHoldingDollar, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountList from "@/components/AccountList";
import CreditCardList from "@/components/CreditCardList";
import CreditCardTransactionList from "@/components/CreditCardTransactionList";
import TransactionOptions from "@/components/TransactionOptions";
import SinpeFlow from "@/components/SinpeFlow";
import IbanFlow from "@/components/IbanFlow";
import TransactionList from "@/components/TransactionList";
import LoanList from "@/components/LoanList";
import LoanDetails from "@/components/LoanDetails";

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

/**
 * Page: Client
 * Página principal del portal de clientes de TecBank.
 *
 * Estructura:
 * - Navegación entre cuentas, tarjetas, préstamos y transferencias.
 * - Renderiza componentes de listas y detalles según la sección seleccionada.
 *
 * Example:
 * <Client />
 */

export default function Client() {
  const router = useRouter();
  const { query } = router;
  const [activePage, setActivePage] = useState("principal");

  useEffect(() => {
    // Sync activePage with query.page, defaulting to "principal"
    setActivePage(query.page || "principal");
  }, [query.page]);

  const handleNavigation = (page, additionalQuery = {}) => {
    const queryString = new URLSearchParams(additionalQuery).toString();
    router.push(`/client?page=${page}${queryString ? `&${queryString}` : ""}`);
  };

  const handleBack = () => {
    if (query.cardNum) {
      handleNavigation("tarjetas");
    } else if (query.transactionlist) {
      handleNavigation("cuentas");
    } else if (query.type === "sinpe" || query.type === "iban") {
      handleNavigation("transferencias");
    } else if (query.loanId) {
      handleNavigation("prestamos");
    } else {
      router.push(`/client?page=principal`);
    }
  };

  return (
    <>
      <Head>
        <title>Portal Clientes - TECBANK</title>
        <meta name="description" content="Portal de Clientes de TECBANK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.logo}>TECBANK</h1>
          <nav className={styles.nav}>
            <button
              className={`${styles.navButton} ${activePage === "principal" ? styles.active : ""}`}
              onClick={() => handleNavigation("principal")}
            >
              Principal
            </button>
            <button
              className={`${styles.navButton} ${activePage === "cuentas" ? styles.active : ""}`}
              onClick={() => handleNavigation("cuentas")}
            >
              Cuentas
            </button>
            <button
              className={`${styles.navButton} ${activePage === "tarjetas" ? styles.active : ""}`}
              onClick={() => handleNavigation("tarjetas")}
            >
              Tarjetas
            </button>
            <button
              className={`${styles.navButton} ${activePage === "prestamos" ? styles.active : ""}`}
              onClick={() => handleNavigation("prestamos")}
            >
              Préstamos
            </button>
            <button
              className={`${styles.navButton} ${activePage === "transferencias" ? styles.active : ""}`}
              onClick={() => handleNavigation("transferencias")}
            >
              Transferencias
            </button>
          </nav>
        </header>

        {/* Main Content */}
        {activePage === "principal" && (
          <Container>
            <Row className={styles.cardRow}>
              <Col xs={12} sm={5} className={styles.cardCol}>
                <Card className={styles.card} onClick={() => handleNavigation("cuentas")}>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.cardTextContainer}>
                      <Card.Title className={styles.cardTitle}>Cuentas</Card.Title>
                      <Card.Text className={styles.cardDescription}>
                        Administra tus cuentas bancarias de forma rápida y segura.
                      </Card.Text>
                    </div>
                    <FontAwesomeIcon icon={faMoneyCheckDollar} className={styles.icon} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={5} className={styles.cardCol}>
                <Card className={styles.card} onClick={() => handleNavigation("tarjetas")}>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.cardTextContainer}>
                      <Card.Title className={styles.cardTitle}>Tarjetas</Card.Title>
                      <Card.Text className={styles.cardDescription}>
                        Consulta y gestiona tus tarjetas de crédito fácilmente.
                      </Card.Text>
                    </div>
                    <FontAwesomeIcon icon={faCreditCard} className={styles.icon} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className={styles.cardRow}>
              <Col xs={12} sm={5} className={styles.cardCol}>
                <Card className={styles.card} onClick={() => handleNavigation("prestamos")}>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.cardTextContainer}>
                      <Card.Title className={styles.cardTitle}>Préstamos</Card.Title>
                      <Card.Text className={styles.cardDescription}>
                        Revisa el estado de tus préstamos y realiza pagos en línea.
                      </Card.Text>
                    </div>
                    <FontAwesomeIcon icon={faHandHoldingDollar} className={styles.icon} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={5} className={styles.cardCol}>
                <Card className={styles.card} onClick={() => handleNavigation("transferencias")}>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.cardTextContainer}>
                      <Card.Title className={styles.cardTitle}>Transferencias</Card.Title>
                      <Card.Text className={styles.cardDescription}>
                        Realiza transferencias de forma rápida y segura.
                      </Card.Text>
                    </div>
                    <FontAwesomeIcon icon={faMoneyBillTransfer} className={styles.icon} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}

        {activePage === "cuentas" && !query.transactionlist && (
          <AccountList
            accounts={[
              { number: "123456789", currency: "Colones", balance: 50000 },
              { number: "987654321", currency: "Dólares", balance: 200 },
            ]} // Replace with actual account data
            onAccountClick={(account) => handleNavigation("cuentas", { transactionlist: account.number })}
            onBack={handleBack}
          />
        )}

        {query.transactionlist && (
          <TransactionList
            account={{
              number: query.transactionlist,
              currency: "Colones",
            }} // Replace with actual account data
            transactions={[
              { name: "Depósito", type: "credito", date: "2023-10-01", time: "10:00", amount: 50000 },
              { name: "Compra en Tienda", type: "debito", date: "2023-10-02", time: "14:30", amount: -15000 },
              { name: "Transferencia", type: "debito", date: "2023-10-03", time: "09:15", amount: -20000 },
            ]} // Replace with actual transaction data
            onBack={handleBack}
          />
        )}

        {activePage === "tarjetas" && !query.cardNum && (
          <CreditCardList
            creditCards={[
              { number: "1234123412341234", brand: "Visa" },
              { number: "5678567856785678", brand: "MasterCard" },
            ]} // Replace with actual credit card data
            onCardClick={(card) => handleNavigation("tarjetas", { cardNum: card.number })}
            onBack={handleBack}
          />
        )}

        {query.cardNum && (
          <CreditCardTransactionList
            card={{
              number: query.cardNum,
              currency: "Colones",
              limit: 100000,
              minPayment: 5000,
              cutoffDate: "2023-10-15",
              paymentDate: "2023-10-30",
            }} // Replace with actual card data
            transactions={[
              { name: "Compra en Supermercado", amount: -20000 },
              { name: "Pago de Servicios", amount: -15000 },
              { name: "Devolución", amount: 5000 },
            ]} // Replace with actual transaction data
            onBack={handleBack}
          />
        )}

        {activePage === "transferencias" && !query.type && (
          <TransactionOptions
            onBack={handleBack}
            onSinpe={() => handleNavigation("transferencias", { type: "sinpe", step: 1 })}
            onIban={() => handleNavigation("transferencias", { type: "iban" })}
          />
        )}

        {query.type === "sinpe" && (
          <SinpeFlow onBack={handleBack} />
        )}

        {query.type === "iban" && (
          <IbanFlow onBack={handleBack} />
        )}

        {activePage === "prestamos" && !query.loanId && (
          <LoanList
            loans={[
              { id: "1", number: "PR-001", type: "Hipotecario" },
              { id: "2", number: "PR-002", type: "Personal" },
            ]} // Replace with actual loan data
            onLoanClick={(loan) => handleNavigation("prestamos", { loanId: loan.id })}
            onBack={handleBack}
          />
        )}

        {query.loanId && (
          <LoanDetails
            loan={{
              id: query.loanId,
              startDate: "2023-01-01",
              term: 24,
              originalAmount: 100000,
              paidAmount: 40000,
              annualInterest: 5.5,
            }} // Replace with actual loan data
            payments={[
              { date: "2023-02-01", paidAmount: 5000, previousDebt: 100000, currentDebt: 95000 },
              { date: "2023-03-01", paidAmount: 5000, previousDebt: 95000, currentDebt: 90000 },
            ]} // Replace with actual payment data
            onBack={handleBack}
          />
        )}
      </div>
    </>
  );
}
