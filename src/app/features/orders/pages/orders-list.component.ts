import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';                    // <-- add
import { ApiService } from '../../../core/services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';

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
  </div>`,
  styles:[`.w{width:100%}`]
})
export class OrdersListComponent {
  orders:any[] = [];
  q = '';

  constructor(private api:ApiService){
    const userId = Number(localStorage.getItem('userId') || 1);
    this.api.get<any[]>('/orders', { userId }).subscribe(r => this.orders = r);
  }
  filtered(){ return this.q ? this.orders.filter(o => (o.orderId as string).includes(this.q)) : this.orders; }
}
