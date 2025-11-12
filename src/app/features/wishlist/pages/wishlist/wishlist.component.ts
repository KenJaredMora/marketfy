import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WishlistService } from '../../wishlist.service';
import { CartService } from '../../../cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [CommonModule, MatButtonModule],
  template: `
  <div style="max-width:900px;margin:auto;padding:16px">
    <h2>Wishlist</h2>
    <div *ngIf="(wl.items$ | async) as items; else empty">
      <div *ngFor="let p of items" class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h3>{{ p.name }}</h3>
            <p>{{ p.price | currency }}</p>
          </div>
          <div style="display:flex;gap:8px">
            <button mat-stroked-button (click)="wl.toggle(p)">Remove</button>
            <button mat-raised-button color="primary" (click)="moveToCart(p)">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
    <ng-template #empty><p style="padding:24px;text-align:center">No items yet.</p></ng-template>
  </div>
  `,
  styles:[`.card{padding:16px;border:1px solid #eee;border-radius:8px;margin-bottom:12px}`]
})
export class WishlistComponent {
  constructor(public wl: WishlistService, private cart: CartService) {}
  moveToCart(p:any){ this.cart.add(p,1); this.wl.toggle(p); }
}
