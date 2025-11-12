import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../wishlist/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

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

  imageLoaded = false;

  constructor(
    private wl: WishlistService,
    private auth: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  wishlisted = computed(() => this.product ? this.wl.isInWishlist(this.product.id) : false);

  onImageLoad() {
    this.imageLoaded = true;
  }

  toggleWishlist(ev: MouseEvent) {
    ev.stopPropagation();

    // Check authentication
    if (!this.auth.isAuthenticated()) {
      this.snackbar.show('Please login to add items to wishlist');
      this.router.navigate(['/auth']);
      return;
    }

    const id = this.product.id as number;
    if (this.wishlisted()) {
      this.wl.removeByProduct(id).subscribe();
    } else {
      this.wl.add(id).subscribe();
    }
  }
}
