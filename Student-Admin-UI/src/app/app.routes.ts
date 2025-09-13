import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Student } from './pages/student/student';
import { Layout } from '@progress/kendo-drawing';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'students',
        component: Student,
      },
    ],
  },
];
