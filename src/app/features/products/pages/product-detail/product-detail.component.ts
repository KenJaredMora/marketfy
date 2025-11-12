import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, MatButtonModule],
  template: `
  <ng-container *ngIf="product; else notFound">
    <div style="padding:24px;max-width:720px;margin:auto">
      <h2>{{ product.name }}</h2>
      <p>{{ product.price | currency }}</p>
      <p>{{ product.description }}</p>
      <button mat-raised-button color="primary" (click)="cart.add(product,1)">Add to cart</button>
    </div>
  </ng-container>
  <ng-template #notFound>
    <p style="padding:24px;text-align:center">Product not found.</p>
  </ng-template>
  `
})
export class ProductDetailComponent {
  product: any;
  constructor(private route: ActivatedRoute, private ps: ProductsService, public cart: CartService) {
    this.product = this.ps.byId(Number(this.route.snapshot.paramMap.get('id')));
  }
}
