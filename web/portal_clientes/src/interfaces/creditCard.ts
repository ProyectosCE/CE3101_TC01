export interface CreditCard {
  number: string;
  brand: string;
  accountNumber: string;
}

export interface CreditCardListProps {
  creditCards: CreditCard[];
  onCardClick: (cardNumber: string) => void;
}
