import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../features/cart/cart.service';
import { WishlistService } from '../../../features/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  cartCount$;
  wishlistCount = computed(() => this.wishlist.count());
  isAuthenticated = computed(() => this.auth.isAuthenticated());

  constructor(
    private cart: CartService,
    private wishlist: WishlistService,
    private auth: AuthService,
    private router: Router
  ) {
    this.cartCount$ = this.cart.cartCount$;
    // Load wishlist on init if authenticated
    if (this.auth.isAuthenticated()) {
      this.wishlist.load().subscribe();
    }
  }

  logout(): void {
    this.auth.logout();
    // Clear wishlist on logout
    this.wishlist.items.set([]);
    // Navigate to auth page
    this.router.navigate(['/auth']).then(() => {
      window.location.reload(); // Force reload to clear any cached state
    });
  }
}
