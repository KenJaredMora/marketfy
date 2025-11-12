import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  removingItems = signal<Set<number>>(new Set());

  constructor(
    public cart: CartService,
    private snackbar: SnackbarService
  ) {}

  inc(id: number) {
    this.cart.updateQty(id, this.stepOf(id, +1));
  }

  dec(id: number) {
    const newQty = this.stepOf(id, -1);
    if (newQty < 1) {
      this.remove(id);
    } else {
      this.cart.updateQty(id, newQty);
    }
  }

  remove(id: number) {
    this.cart.remove(id);
    this.snackbar.show('Item removed from cart');
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cart.clear();
      this.snackbar.show('Cart cleared');
    }
  }

  private stepOf(id: number, step: number) {
    const items = (this.cart as any).subject.value as {product: {id: number}, qty: number}[];
    const found = items.find(i => i.product.id === id);
    const next = Math.max(1, (found?.qty ?? 1) + step);
    return next;
  }

  getItemTotal(price: number, qty: number): number {
    return price * qty;
  }
}
