import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../wishlist.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  imports: [CommonModule, MatListModule, MatButtonModule, RouterLink],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <h2>Your wishlist</h2>
    <ng-container *ngIf="wl.items().length; else empty">
      <mat-nav-list>
        <div mat-subheader>{{ wl.items().length }} item(s)</div>

        <a mat-list-item *ngFor="let it of wl.items()" [routerLink]="['/products', it.productId]">
          <span matListItemTitle>{{ it.product.name }}</span>
          <span matListItemLine>{{ it.product.price | currency }}</span>
          <span class="spacer"></span>
          <button mat-stroked-button color="primary" (click)="addToCart($event, it.product)">Add to cart</button>
          <button mat-button color="warn" (click)="remove($event, it.id)">Remove</button>
        </a>
      </mat-nav-list>
    </ng-container>

    <ng-template #empty>
      <div>No items yet. Browse <a routerLink="/products">products</a>.</div>
    </ng-template>
  </div>
  `,
  styles:[`
    .spacer { flex: 1 1 auto; }
    a[mat-list-item] { align-items: center; }
  `]
})
export class WishlistComponent {
  constructor(public wl: WishlistService, private cart: CartService) {
    this.wl.load().subscribe();
  }

  addToCart(ev: MouseEvent, product: any) {
    ev.preventDefault(); ev.stopPropagation();
    this.cart.add(product, 1);
  }

  remove(ev: MouseEvent, id: number) {
    ev.preventDefault(); ev.stopPropagation();
    this.wl.removeById(id).subscribe();
  }
}
