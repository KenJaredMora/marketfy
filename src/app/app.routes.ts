// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },

  {
    path: 'products',
    canActivate: [authGuard], // <- opcional proteger
    loadComponent: () =>
      import('./features/products/pages/products-list/products-list.component')
        .then(m => m.ProductsListComponent),
  },

  {
    path: 'products/:id',
    canActivate: [authGuard], // <- opcional proteger
    loadComponent: () =>
      import('./features/products/pages/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
  },

  {
    path: 'cart',
    canActivate: [authGuard], // <- opcional proteger
    loadComponent: () =>
      import('./features/cart/pages/cart/cart.component')
        .then(m => m.CartComponent),
  },

  {
    path: 'wishlist',
    canActivate: [authGuard], // <- opcional proteger
    loadComponent: () =>
      import('./features/wishlist/pages/wishlist/wishlist.component')
        .then(m => m.WishlistComponent),
  },

  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/checkout/checkout.component')
        .then(m => m.CheckoutComponent),
  },

  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/orders/orders.component')
        .then(m => m.OrdersComponent),
  },

  {
    path: 'orders/:orderId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-detail/order-detail.component')
        .then(m => m.OrderDetailComponent),
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/pages/profile/profile.component')
        .then(m => m.ProfileComponent),
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(m => m.LoginComponent),
  },

  { path: '**', redirectTo: 'products' },
];
