import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../products.service';
import { CartService } from '../../../cart/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { WishlistService } from '../../../wishlist/wishlist.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  constructor(public ps: ProductsService, private cart: CartService, private wishlist: WishlistService) {
    this.wishlist.load().subscribe();
  }
  add(p:any) { this.cart.add(p, 1); }
  setPage(n:number){ this.ps.page.set(n); }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.ps.total() / this.ps.limit()));
  }
}
