import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductsService } from '../../products.service';
import { CartService } from '../../../cart/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { WishlistService } from '../../../wishlist/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  animations: [
    trigger('fadeIn', [
      transition('hidden => visible', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms {{delay}}ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ], { params: { delay: 0 } })
    ])
  ]
})
export class ProductsListComponent {
  isTransitioning = signal(false);
  imagesLoaded = signal(false);

  constructor(
    public ps: ProductsService,
    private cart: CartService,
    private wishlist: WishlistService,
    private auth: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {
    // Only load wishlist if authenticated
    if (this.auth.isAuthenticated()) {
      this.wishlist.load().subscribe();
    }

    // Watch for page changes to trigger transitions
    effect(() => {
      // Track page changes
      this.ps.page();
      this.ps.search();

      // Start transition
      this.isTransitioning.set(true);
      this.imagesLoaded.set(false);

      // Wait a bit for data to load, then preload images
      setTimeout(() => {
        this.preloadImages();
      }, 100);
    });
  }

  add(p: any) {
    if (!this.auth.isAuthenticated()) {
      this.snackbar.show('Please login to add items to cart');
      this.router.navigate(['/auth']);
      return;
    }
    this.cart.add(p, 1);
  }

  setPage(n: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ps.page.set(n);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.ps.total() / this.ps.limit()));
  }

  private preloadImages() {
    const products = this.ps.pageItems();
    if (products.length === 0) {
      this.isTransitioning.set(false);
      this.imagesLoaded.set(true);
      return;
    }

    const imageUrls = products
      .map(p => p.imageUrl)
      .filter(url => url) as string[];

    if (imageUrls.length === 0) {
      this.isTransitioning.set(false);
      this.imagesLoaded.set(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          // Small delay for smooth transition
          setTimeout(() => {
            this.imagesLoaded.set(true);
            this.isTransitioning.set(false);
          }, 150);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setTimeout(() => {
            this.imagesLoaded.set(true);
            this.isTransitioning.set(false);
          }, 150);
        }
      };
      img.src = url;
    });

    // Fallback timeout in case images take too long
    setTimeout(() => {
      if (!this.imagesLoaded()) {
        this.imagesLoaded.set(true);
        this.isTransitioning.set(false);
      }
    }, 3000);
  }
}
