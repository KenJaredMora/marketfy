import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CartService } from '../../../cart/cart.service';
import { OrdersService } from '../../orders.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  total$;
  items$;
  form;
  processing = signal(false);
  promoApplied = signal(false);
  promoDiscount = signal(0);
  shippingCost = signal(0);

  shippingOptions = [
    { value: 0, label: 'Standard Shipping', time: '5-7 business days', icon: 'local_shipping' },
    { value: 9.99, label: 'Express Shipping', time: '2-3 business days', icon: 'bolt' },
    { value: 19.99, label: 'Overnight Shipping', time: 'Next business day', icon: 'flight_takeoff' }
  ];

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private orders: OrdersService,
    private router: Router,
    private snackbar: SnackbarService
  ) {
    this.total$ = this.cart.total$;
    this.items$ = this.cart.items$;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,}$/)]],
      shippingMethod: [0, Validators.required],
      promoCode: ['']
    });

    // Update shipping cost when method changes
    this.form.get('shippingMethod')?.valueChanges.subscribe(cost => {
      this.shippingCost.set(Number(cost));
    });
  }

  applyPromoCode() {
    const code = this.form.get('promoCode')?.value?.toUpperCase();
    if (!code) {
      this.snackbar.show('Please enter a promo code');
      return;
    }

    // Simulated promo codes
    const promoCodes: { [key: string]: number } = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'FIRSTORDER': 0.15
    };

    if (promoCodes[code]) {
      this.promoDiscount.set(promoCodes[code]);
      this.promoApplied.set(true);
      this.snackbar.show(`Promo code applied! ${promoCodes[code] * 100}% off`);
    } else {
      this.snackbar.show('Invalid promo code');
    }
  }

  removePromo() {
    this.promoDiscount.set(0);
    this.promoApplied.set(false);
    this.form.patchValue({ promoCode: '' });
    this.snackbar.show('Promo code removed');
  }

  getSubtotal(): number {
    let total = 0;
    this.total$.subscribe((v: any) => total = v || 0).unsubscribe();
    return total;
  }

  getDiscountAmount(): number {
    return this.getSubtotal() * this.promoDiscount();
  }

  getGrandTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscountAmount();
    const shipping = this.shippingCost();
    return subtotal - discount + shipping;
  }

  async submit() {
    if (this.form.invalid) {
      this.snackbar.show('Please fill in all required fields correctly');
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.processing.set(true);

    try {
      let items: any[] = [];
      this.items$.subscribe((v: any) => items = v).unsubscribe();

      // Create order via backend API
      const order = await this.orders.create(items, this.getGrandTotal());

      this.cart.clear();
      this.snackbar.show('Order placed successfully!');
      this.router.navigate(['/orders', order.orderId]);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      this.snackbar.show(error?.error?.message || 'Failed to create order. Please try again.');
    } finally {
      this.processing.set(false);
    }
  }
}
