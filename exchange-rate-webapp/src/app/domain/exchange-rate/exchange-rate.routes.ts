import { Routes } from "@angular/router";

export const EXCHANGE_RATE_ROUTES: Routes = [
  {
    path: 'converter',
    loadComponent: () => import('./components/exchange-rate-converter/exchange-rate-converter.component').then(c => c.ExchangeRateConverterComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./components/exchange-rate-history/exchange-rate-history.component').then(c => c.ExchangeRateHistoryComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'converter'
  }
]
