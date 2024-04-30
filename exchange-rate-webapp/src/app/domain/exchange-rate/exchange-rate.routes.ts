import { Routes } from "@angular/router";

export const EXCHANGE_RATE_ROUTES: Routes = [
  {
    path: 'converter',
    loadComponent: () => import('./pages/exchange-rate-converter/exchange-rate-converter.page').then(c => c.ExchangeRateConverterPage)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/exchange-rate-history/exchange-rate-history.page').then(c => c.ExchangeRateHistoryPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'converter'
  }
]
