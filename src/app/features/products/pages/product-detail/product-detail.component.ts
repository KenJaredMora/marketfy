import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
  <div *ngIf="loading" style="text-align:center;padding:32px">
    <mat-spinner diameter="50" style="margin:auto"></mat-spinner>
    <p>Loading product...</p>
  </div>

  <ng-container *ngIf="!loading && product; else notFound">
    <div style="padding:24px;max-width:720px;margin:auto">
      <img *ngIf="product.imageUrl"
           [src]="product.imageUrl"
           [alt]="product.name"
           style="max-width:100%;height:auto;border-radius:8px;margin-bottom:16px">
      <h2>{{ product.name }}</h2>
      <p style="font-size:24px;font-weight:bold;color:#1976d2">{{ product.price | currency }}</p>
      <p *ngIf="product.description">{{ product.description }}</p>
      <div *ngIf="product.tags?.length" style="margin:16px 0">
        <span *ngFor="let tag of product.tags"
              style="display:inline-block;padding:4px 12px;margin:4px;background:#e3f2fd;border-radius:16px;font-size:12px">
          {{ tag }}
        </span>
      </div>
      <button mat-raised-button color="primary" (click)="cart.add(product,1)">Add to cart</button>
    </div>
  </ng-container>

  <ng-template #notFound>
    <p *ngIf="!loading" style="padding:24px;text-align:center">Product not found.</p>
  </ng-template>
  `
})
export class ProductDetailComponent {
  product: any;
  loading = true;

  constructor(private route: ActivatedRoute, private ps: ProductsService, public cart: CartService) {
    this.loadProduct();
  }

  async loadProduct() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = await this.ps.byId(id);
    this.loading = false;
  }
}
