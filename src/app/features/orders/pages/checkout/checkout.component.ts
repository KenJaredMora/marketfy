import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CartService } from '../../../cart/cart.service';
import { OrdersService } from '../../orders.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <h2>Checkout</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="w-full">
        <input matInput placeholder="Full name" formControlName="name"/>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <input matInput placeholder="Email" formControlName="email"/>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <textarea matInput placeholder="Address" formControlName="address" rows="3"></textarea>
      </mat-form-field>

      <button mat-raised-button color="primary" [disabled]="form.invalid || (total$|async) === null || (total$|async) === 0" type="submit">
        Confirm & Place Order
      </button>
    </form>
  </div>
  `,
  styles: [`.w-full{width:100%}`]
})
export class CheckoutComponent {
  total$;
  form;

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private orders: OrdersService,
    private router: Router,
  ) {
    this.total$ = this.cart.total$;
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    let items: any[] = [];
    (this.cart as any).items$.subscribe((v: any) => items = v).unsubscribe();
    let total = 0;
    this.total$.subscribe((v: any) => total = v).unsubscribe();

    const order = this.orders.create(items, total);
    this.cart.clear();
    this.router.navigate(['/orders', order.orderId]);
  }
}
