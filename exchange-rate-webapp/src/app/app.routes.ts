import { Routes } from '@angular/router';
import { BaseContainer, EmptyContainer } from "@ibk/layout/containers";
import { authGuard, noAuthGuard } from "@ibk/core/guards";

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    component: EmptyContainer,
    loadChildren: () => import('./domain/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'exchange-rate',
    component: BaseContainer,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./domain/exchange-rate/exchange-rate.page').then(c => c.ExchangeRatePage),
        loadChildren: () => import('./domain/exchange-rate/exchange-rate.routes').then(r => r.EXCHANGE_RATE_ROUTES)
      }
    ]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./domain/not-found/not-found.page').then(c => c.NotFoundPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'not-found'
  }
];
