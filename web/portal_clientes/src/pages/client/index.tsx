import Head from "next/head";
import { useRouter } from "next/router";
import ClientLayout from "@/components/client/ClientLayout";
import styles from "@/styles/client.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faCreditCard, faHandHoldingDollar, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { Container, Row } from "react-bootstrap";

interface CardItemProps {
  title: string;
  description: string;
  icon: any; // Replace 'any' with a more specific type if possible
  onClick: () => void;
}

const CardItem = ({ title, description, icon, onClick }: CardItemProps) => (
  <div className={styles.card} onClick={onClick}>
    <div className={styles.cardBody}>
      <div className={styles.cardTextContainer}>
        <h5 className={styles.cardTitle}>{title}</h5>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </div>
  </div>
);

export default function Client() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  return (
    <>
      <Head>
        <title>Portal Clientes - TECBANK</title>
        <meta name="description" content="Portal de Clientes de TECBANK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <Container>
          <Row className={styles.cardRow}>
            <CardItem
              title="Cuentas"
              description="Administra tus cuentas bancarias de forma rápida y segura."
              icon={faMoneyCheckDollar}
              onClick={() => navigateTo("cuentas")}
            />
            <CardItem
              title="Tarjetas"
              description="Consulta y gestiona tus tarjetas de crédito fácilmente."
              icon={faCreditCard}
              onClick={() => navigateTo("tarjetas")}
            />
          </Row>
          <Row className={styles.cardRow}>
            <CardItem
              title="Préstamos"
              description="Revisa el estado de tus préstamos y realiza pagos en línea."
              icon={faHandHoldingDollar}
              onClick={() => navigateTo("prestamos")}
            />
            <CardItem
              title="Transferencias"
              description="Realiza transferencias de forma rápida y segura."
              icon={faMoneyBillTransfer}
              onClick={() => navigateTo("transferencias")}
            />
          </Row>
        </Container>
      </ClientLayout>
    </>
  );
}
