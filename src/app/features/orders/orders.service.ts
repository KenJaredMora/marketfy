import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { CartItem } from '../cart/cart.service';

export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  createdAt: string; // ISO
}

const KEY = 'marketfy_orders';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private read(): Order[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  private write(orders: Order[]) { localStorage.setItem(KEY, JSON.stringify(orders)); }

  create(items: CartItem[], total: number): Order {
    const order: Order = { orderId: uuid(), items, total, createdAt: new Date().toISOString() };
    const all = this.read();
    all.unshift(order);
    this.write(all);
    return order;
  }

  getAll(): Order[] { return this.read(); }
  findById(orderId: string): Order | undefined { return this.read().find(o => o.orderId === orderId); }
}
