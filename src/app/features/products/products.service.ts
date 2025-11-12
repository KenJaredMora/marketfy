import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
  description?: string;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private api = inject(ApiService);

  private _all = signal<Product[]>([]);
  private _total = signal(0);

  search = signal('');
  page = signal(1);
  limit = signal(12);

  // Computed values
  filtered = computed(() => this._all());
  total = computed(() => this._total());
  pageItems = computed(() => this._all());

  constructor() {
    // Load initial products
    this.loadProducts();

    // Reload when search, page, or limit changes
    effect(() => {
      // Track dependencies
      this.search();
      this.page();
      this.limit();

      // Load products
      this.loadProducts();
    });
  }

  private loadProducts() {
    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };

    const searchQuery = this.search().trim();
    if (searchQuery) {
      params.q = searchQuery;
    }

    this.api.get<ProductsResponse>('/products', params).subscribe({
      next: (response) => {
        this._all.set(response.items);
        this._total.set(response.total);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this._all.set([]);
        this._total.set(0);
      }
    });
  }

  // Get product by ID from backend
  byId(id: number): Promise<Product | null> {
    return new Promise((resolve) => {
      this.api.get<Product>(`/products/${id}`).subscribe({
        next: (product) => resolve(product),
        error: (error) => {
          console.error('Failed to load product:', error);
          resolve(null);
        }
      });
    });
  }
}
