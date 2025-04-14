import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ClientLayout from "@/components/client/ClientLayout";
import CreditCardList from "@/components/CreditCardList";
import { Tarjeta } from "@/interfaces/tarjeta";
import { CreditCard } from "@/interfaces/creditCard";
import { API_ENDPOINT } from "@/config/api";
import { useAuthStore } from "@/stores/authStore";

export default function CreditCardListPage() {
  const router = useRouter();
  const [creditCards, setCreditCards] = useState<Tarjeta[]>([]);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchCreditCards = async () => {
      if (!userInfo?.cedula) return;
      try {
        const response = await fetch(
          `${API_ENDPOINT}Tarjeta/consultarTarjetas/${userInfo.cedula}`
        );
        const data = await response.json();
        setCreditCards(data);
      } catch (error) {
        console.error("Error fetching credit cards:", error);
      }
    };

    fetchCreditCards();
  }, [userInfo?.cedula]);

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  const handleCardClick = (cardNumber: string) => {
    router.push(`/client/tarjetas/cardTransactions?cardNumber=${cardNumber}`);
  };

  const mappedCards: CreditCard[] = creditCards.map((card: Tarjeta) => ({
    number: card.numero_tarjeta,
    brand: card.marca,
    accountNumber: card.numero_cuenta,
  }));

  return (
    <>
      <Head>
        <title>Tarjetas - TECBANK</title>
        <meta
          name="description"
          content="Administra tus tarjetas de crédito de forma rápida y segura."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout onNavigate={navigateTo}>
        <CreditCardList
          creditCards={mappedCards}
          onCardClick={handleCardClick}
        />
      </ClientLayout>
    </>
  );
}
