import { Injectable, signal, computed } from '@angular/core';

export interface Product { id:number; name:string; price:number; imageUrl?:string; tags?:string[]; description?:string; }

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private _all = signal<Product[]>([
    { id: 1,  name: 'Sample Tee',        price: 19.99, description: 'Soft cotton tee' },
    { id: 2,  name: 'Coffee Mug',        price: 12.50, description: 'Ceramic 300ml' },
    { id: 3,  name: 'Notebook',          price: 7.00,  description: 'A6 dotted' },
    { id: 4,  name: 'Wireless Mouse',    price: 24.90, description: '2.4GHz ergonomic' },
    { id: 5,  name: 'Water Bottle',      price: 15.00, description: 'Insulated 500ml' },
    { id: 6,  name: 'Hoodie',            price: 39.99, description: 'Fleece unisex' },
    { id: 7,  name: 'Desk Lamp',         price: 18.49, description: 'LED, warm light' },
    { id: 8,  name: 'Phone Stand',       price: 9.99,  description: 'Aluminum adjustable' },
    { id: 9,  name: 'Backpack',          price: 44.00, description: '20L daily carry' },
    { id: 10, name: 'Socks (3-pack)',    price: 8.99,  description: 'Breathable cotton' },
    { id: 11, name: 'Mechanical Pencil', price: 3.49,  description: '0.5mm with grip' },
    { id: 12, name: 'Sticky Notes',      price: 2.99,  description: '100 sheets neon' },
    { id: 13, name: 'Laptop Sleeve',     price: 21.50, description: '13-inch neoprene' },
    { id: 14, name: 'Bluetooth Speaker', price: 29.95, description: 'Portable mini' },
    { id: 15, name: 'Keychain',          price: 4.25,  description: 'Leather loop' },
    { id: 16, name: 'Cap',               price: 14.99, description: 'Adjustable brim' },
    { id: 17, name: 'Travel Mug',        price: 17.49, description: 'Spill-proof 350ml' },
    { id: 18, name: 'Desk Mat',          price: 22.00, description: 'PU leather 80×30cm' },
    { id: 19, name: 'USB-C Cable',       price: 6.99,  description: '1m fast charge' },
    { id: 20, name: 'Poster',            price: 11.00, description: 'A3 matte print' },
    { id: 21, name: 'Pen Set (5)',       price: 5.99,  description: 'Gel black ink' },
    { id: 22, name: 'Beige Tote',        price: 12.00, description: 'Canvas shopper' },
    { id: 23, name: 'Fitness Band',      price: 26.99, description: 'Latex-free light' },
    { id: 24, name: 'Sticker Pack',      price: 3.75,  description: 'Vinyl assorted' },
    { id: 25, name: 'Wireless Charger',  price: 27.90, description: 'Qi 10W pad' },
  ]);


  search = signal('');
  page = signal(1);
  limit = signal(9);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const list = q
      ? this._all().filter(p =>
          p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      : this._all();
    return list;
  });

  total = computed(() => this.filtered().length);

  pageItems = computed(() => {
    const start = (this.page() - 1) * this.limit();
    return this.filtered().slice(start, start + this.limit());
  });

  // for product detail:
  byId(id:number) { return this._all().find(p => p.id === id); }
}
