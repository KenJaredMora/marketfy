import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { OrdersService } from '../orders.service';

@Component({
  standalone: true,
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, RouterLink, MatListModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <h2>Order History</h2>
    <mat-form-field class="w" appearance="outline">
      <input matInput placeholder="Search by Order ID…" [(ngModel)]="q">
    </mat-form-field>

    <mat-nav-list>
      <a mat-list-item *ngFor="let o of filtered()" [routerLink]="['/orders', o.orderId]">
        <span matListItemTitle>Order {{o.orderId}}</span>
        <span matListItemLine>Total: {{o.total | currency}} — {{ o.createdAt | date:'short' }}</span>
      </a>
    </mat-nav-list>

    <p *ngIf="orders.length === 0" style="text-align:center;color:#666;margin-top:32px;">
      No orders found. Start shopping to create your first order!
    </p>
  </div>`,
  styles:[`.w{width:100%}`]
})
export class OrdersListComponent {
  orders: any[] = [];
  q = '';

  constructor(private ordersService: OrdersService) {
    // Fetch orders from backend API
    this.ordersService.getAll().subscribe({
      next: (response) => {
        this.orders = response.data;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  filtered() {
    return this.q
      ? this.orders.filter(o => (o.orderId as string).toLowerCase().includes(this.q.toLowerCase()))
      : this.orders;
  }
}
