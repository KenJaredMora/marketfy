import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../orders.service';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule],
  template: `
  <div style="max-width:900px;margin:auto;padding:16px">
    <h2>Order History</h2>

    <mat-form-field appearance="outline" style="width:100%;max-width:420px">
      <input matInput placeholder="Search by Order ID…" (input)="q = $any($event.target).value">
    </mat-form-field>

    <table *ngIf="filtered().length; else empty" style="width:100%;border-collapse:collapse">
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

    <ng-template #empty><p style="padding:24px;text-align:center">No orders found.</p></ng-template>
  </div>
  `
})
export class OrdersComponent {
  q = '';
  constructor(private orders: OrdersService) {}
  filtered(): Order[] {
    const all = this.orders.getAll();
    const q = this.q.trim().toLowerCase();
    return q ? all.filter(o => o.orderId.toLowerCase().includes(q)) : all;
  }
}
