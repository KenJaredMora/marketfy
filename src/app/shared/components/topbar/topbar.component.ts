import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../features/cart/cart.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, AsyncPipe, NgIf],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  cartCount$;
  constructor(private cart: CartService) {
    this.cartCount$ = this.cart.cartCount$;
  }
}
