import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { tap } from 'rxjs/operators';

export interface WishlistItemDTO {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  items = signal<WishlistItemDTO[]>([]);
  count = computed(() => this.items().length);

  constructor(private api: ApiService) {}

  private get userId(): number {
    return Number(localStorage.getItem('userId') || 1);
  }

  load() {
    return this.api.get<WishlistItemDTO[]>('/wishlist', { userId: this.userId })
      .pipe(tap(list => this.items.set(list)));
  }

  isInWishlist(productId: number): boolean {
    return !!this.items().find(i => i.productId === productId);
  }

  add(productId: number) {
    return this.api.post('/wishlist', { userId: this.userId, productId })
      .pipe(tap(() => this.load().subscribe()));
  }

  removeByProduct(productId: number) {
    return this.api.delete('/wishlist', { userId: String(this.userId), productId: String(productId) })
      .pipe(tap(() => this.load().subscribe()));
  }

  removeById(id: number) {
    return this.api.delete(`/wishlist/${id}`, { userId: String(this.userId) })
      .pipe(tap(() => this.load().subscribe()));
  }
}
