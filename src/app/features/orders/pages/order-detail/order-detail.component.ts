import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px" *ngIf="order">
    <h2>Order {{order.orderId}}</h2>
    <div>Date: {{ order.createdAt | date:'short' }}</div>
    <div>Total: {{ order.total | currency }}</div>
    <h3 style="margin-top:12px">Items</h3>
    <ul>
      <li *ngFor="let it of order.items">
        {{ it.product.name }} × {{ it.qty }} — {{ (it.product.price * it.qty) | currency }}
      </li>
    </ul>
  </div>`
})
export class OrderDetailComponent {
  order:any;
  constructor(route:ActivatedRoute, api:ApiService) {
    const orderId = route.snapshot.paramMap.get('orderId')!;
    api.get(`/orders/${orderId}`).subscribe(o => this.order = o);
  }
}
