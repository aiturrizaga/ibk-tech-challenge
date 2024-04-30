export interface Currency {
  name: string;
  code: string;
  country: string;
  symbol: string;
  flagUrl: string;
}

export interface CurrencySelect {
  dialogTitle?: string;
  currentCurrency?: Currency;
  excludeCurrency?: Currency;
}
