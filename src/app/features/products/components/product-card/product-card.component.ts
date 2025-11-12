import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  template: `
  <div class="card">
    <img *ngIf="product?.imageUrl" [src]="product.imageUrl" alt="{{product.name}}" />
    <h3 data-testid="name">{{ product?.name }}</h3>
    <p>{{ product?.price | currency }}</p>
    <div class="row">
      <button mat-raised-button color="primary" (click)="addToCart.emit(product)">Add to cart</button>
      <a mat-stroked-button [routerLink]="['/products', product?.id]">More details</a>
    </div>
  </div>
  `,
  styles: [`.card{padding:16px;border:1px solid #eee;border-radius:8px}`]
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();
}
