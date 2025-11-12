import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, MatButtonModule, RouterLink],
  template: `
  <div style="max-width:900px;margin:auto;padding:16px">
    <h2>Your Cart</h2>
    <table *ngIf="(cart.items$ | async) as items; else empty" style="width:100%;border-collapse:collapse">
      <thead><tr><th align="left">Product</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let it of items" style="border-top:1px solid #eee">
          <td>{{ it.product.name }}</td>
          <td>
            <button mat-stroked-button (click)="dec(it.product.id)">-</button>
            <span style="padding:0 8px">{{ it.qty }}</span>
            <button mat-stroked-button (click)="inc(it.product.id)">+</button>
          </td>
          <td align="right">{{ it.product.price | currency }}</td>
          <td align="right">{{ (it.product.price * it.qty) | currency }}</td>
          <td align="right"><button mat-button color="warn" (click)="remove(it.product.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>

    <ng-container *ngIf="cart.total$ | async as total">
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:16px" *ngIf="total>0">
        <strong style="align-self:center">Total: {{ total | currency }}</strong>
        <a mat-raised-button color="primary" routerLink="/checkout">Checkout</a>
        <button mat-stroked-button color="warn" (click)="cart.clear()">Clear</button>
      </div>
    </ng-container>
  </div>

  <ng-template #empty>
    <p style="padding:24px;text-align:center">Your cart is empty.</p>
  </ng-template>
  `
})
export class CartComponent {
  constructor(public cart: CartService) {}
  inc(id:number){ this.cart.updateQty(id, this.stepOf(id, +1)); }
  dec(id:number){ this.cart.updateQty(id, this.stepOf(id, -1)); }
  remove(id:number){ this.cart.remove(id); }

  private stepOf(id:number, step:number){
    // read current qty and add step, clamp to >=1
    const items = (this.cart as any).subject.value as {product:{id:number}, qty:number}[];
    const found = items.find(i => i.product.id===id);
    const next = Math.max(1, (found?.qty ?? 1) + step);
    return next;
  }
}
