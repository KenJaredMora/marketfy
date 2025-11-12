import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../orders.service';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  template: `
  <div style="max-width:900px;margin:auto;padding:16px">
    <h2>Order History</h2>

    <mat-form-field appearance="outline" style="width:100%;max-width:420px">
      <input matInput placeholder="Search by Order ID…" (input)="q = $any($event.target).value">
    </mat-form-field>

    <div *ngIf="loading" style="text-align:center;padding:32px">
      <mat-spinner diameter="50" style="margin:auto"></mat-spinner>
      <p>Loading orders...</p>
    </div>

    <table *ngIf="!loading && filtered().length; else empty" style="width:100%;border-collapse:collapse">
      <thead><tr><th align="left">Order ID</th><th>Date</th><th align="right">Total</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let o of filtered()" style="border-top:1px solid #eee">
          <td>{{ o.orderId }}</td>
          <td>{{ o.createdAt | date:'medium' }}</td>
          <td align="right">{{ o.total | currency }}</td>
          <td align="right"><a [routerLink]="['/orders', o.orderId]">View</a></td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p *ngIf="!loading" style="padding:24px;text-align:center">No orders found.</p>
    </ng-template>
  </div>
  `
})
export class OrdersComponent {
  q = '';
  orders: Order[] = [];
  loading = true;

  constructor(private ordersService: OrdersService) {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAll().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.loading = false;
      }
    });
  }

  filtered(): Order[] {
    const q = this.q.trim().toLowerCase();
    return q
      ? this.orders.filter(o => o.orderId.toLowerCase().includes(q))
      : this.orders;
  }
}
