import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(c => c.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(c => c.RegisterPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
]
