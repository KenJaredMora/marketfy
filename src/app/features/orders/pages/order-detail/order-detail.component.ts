import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../orders.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <div *ngIf="loading" style="text-align:center;padding:32px">
      <mat-spinner diameter="50" style="margin:auto"></mat-spinner>
      <p>Loading order...</p>
    </div>

    <div *ngIf="error" style="text-align:center;padding:32px">
      <p style="color:#d32f2f">{{ error }}</p>
      <button mat-raised-button color="primary" (click)="goBack()">Back to Orders</button>
    </div>

    <div *ngIf="order && !loading && !error">
      <h2>Order {{order.orderId}}</h2>
      <div>Date: {{ order.createdAt | date:'short' }}</div>
      <div>Total: {{ order.total | currency }}</div>
      <h3 style="margin-top:12px">Items</h3>
      <ul>
        <li *ngFor="let it of order.items">
          {{ it.product.name }} × {{ it.qty }} — {{ (it.product.price * it.qty) | currency }}
        </li>
      </ul>
      <button mat-raised-button (click)="goBack()" style="margin-top:16px">Back to Orders</button>
    </div>
  </div>`
})
export class OrderDetailComponent {
  order: any;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {
    const orderId = this.route.snapshot.paramMap.get('orderId')!;

    this.ordersService.findById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order:', err);
        this.error = err?.error?.message || 'Order not found. It may have been created locally before backend integration.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
