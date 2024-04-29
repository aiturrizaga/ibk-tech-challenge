export interface ExchangeRateRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface ExchangeRateResponse {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  conversionRate: number;
  conversionResult: number;
}

export interface ExchangeRateHistory {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  amountConvert: string;
  conversionRate: number;
  conversionResult: number;
  timestamp: Date;
}
