import { Injectable, inject } from '@angular/core';
import { CartItem } from '../cart/cart.service';
import { ApiService } from '../../core/services/api.service';
import { Observable, firstValueFrom } from 'rxjs';

export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  createdAt: string; // ISO
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private api = inject(ApiService);

  /**
   * Create a new order via the backend API
   */
  async create(items: CartItem[], total: number): Promise<Order> {
    return firstValueFrom(
      this.api.post<Order>('/orders', { items, total })
    );
  }

  /**
   * Get all orders for the current user from the backend
   */
  getAll(page: number = 1, limit: number = 20): Observable<OrdersResponse> {
    return this.api.get<OrdersResponse>('/orders', { page, limit });
  }

  /**
   * Find a specific order by ID from the backend
   */
  findById(orderId: string): Observable<Order> {
    return this.api.get<Order>(`/orders/${orderId}`);
  }
}
