import { Routes } from '@angular/router';
import { AuthGuard } from './auth/authGuard';
import { Dashboard } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { NoAuthGuard } from './auth/noAuthGuard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
