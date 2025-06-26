import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'equines',
    loadComponent: () => import('./features/equines/equines.component').then(m => m.EquinesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'health-books',
    loadComponent: () => import('./features/health-books/health-books.component').then(m => m.HealthBooksComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'stables',
    loadComponent: () => import('./features/stables/stables.component').then(m => m.StablesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'travels',
    loadComponent: () => import('./features/travels/travels.component').then(m => m.TravelsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'breeds',
    loadComponent: () => import('./features/breeds/breeds.component').then(m => m.BreedsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];