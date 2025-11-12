import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../wishlist.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/cart.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  loading = signal(true);

  constructor(
    public wl: WishlistService,
    private cart: CartService,
    private snackbar: SnackbarService
  ) {
    this.wl.load().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.snackbar.show('Failed to load wishlist');
      }
    });
  }

  addToCart(product: any) {
    this.cart.add(product, 1);
    this.snackbar.show(`${product.name} added to cart!`);
  }

  remove(id: number, productName: string) {
    this.wl.removeById(id).subscribe({
      next: () => this.snackbar.show(`${productName} removed from wishlist`),
      error: () => this.snackbar.show('Failed to remove item')
    });
  }

  moveToCart(item: any) {
    this.cart.add(item.product, 1);
    this.wl.removeById(item.id).subscribe({
      next: () => this.snackbar.show(`${item.product.name} moved to cart!`),
      error: () => this.snackbar.show('Failed to move item')
    });
  }
}
