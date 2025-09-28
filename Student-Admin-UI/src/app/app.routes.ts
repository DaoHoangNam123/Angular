import { Routes } from '@angular/router';
import { AuthGuard } from './auth/authGuard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NoAuthGuard } from './auth/noAuthGuard';
import { TreeComponent } from './pages/tree/tree.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'tree', component: TreeComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
