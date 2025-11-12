import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../wishlist/wishlist.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  constructor(private wl: WishlistService) {}

  wishlisted = computed(() => this.product ? this.wl.isInWishlist(this.product.id) : false);

  toggleWishlist(ev: MouseEvent) {
    ev.stopPropagation();
    const id = this.product.id as number;
    if (this.wishlisted()) {
      this.wl.removeByProduct(id).subscribe();
    } else {
      this.wl.add(id).subscribe();
    }
  }
}
