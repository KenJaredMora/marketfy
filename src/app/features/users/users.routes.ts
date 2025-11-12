import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const USERS_ROUTES: Routes = [
  { path: '', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
];
