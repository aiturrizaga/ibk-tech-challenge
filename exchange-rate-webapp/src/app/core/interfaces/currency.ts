export interface Currency {
  name: string;
  code: string;
  country: string;
  symbol: string;
  flagUrl: string;
}

export interface CurrencySelect {
  type: 'base' | 'target';
  currentCurrency?: Currency;
  excludeCurrency?: Currency;
}
