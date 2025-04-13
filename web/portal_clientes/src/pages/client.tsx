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
import TransactionOptions from "@/components/TransactionOptions";
import SinpeFlow from "@/components/SinpeFlow";
import IbanFlow from "@/components/IbanFlow";

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
    if (query.type === "sinpe" || query.type === "iban") {
      handleNavigation("transferencias");
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

        {activePage === "cuentas" && (
          <AccountList
            accounts={[
              { number: "123456789", currency: "Colones", balance: 50000 },
              { number: "987654321", currency: "Dólares", balance: 200 },
            ]} // Replace with actual account data
            onAccountClick={(account) => console.log(account)}
            onBack={handleBack}
          />
        )}

        {activePage === "tarjetas" && (
          <CreditCardList
            creditCards={[
              { number: "1234123412341234", brand: "Visa" },
              { number: "5678567856785678", brand: "MasterCard" },
            ]} // Replace with actual credit card data
            onCardClick={(card) => console.log(card)}
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
      </div>
    </>
  );
}
