import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../cart.service';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <h2>Checkout</h2>
    <div style="margin:8px 0 16px">Total: <strong>{{ total | currency }}</strong></div>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field class="w" appearance="outline">
        <input matInput placeholder="Full name" formControlName="name">
      </mat-form-field>
      <mat-form-field class="w" appearance="outline">
        <input matInput placeholder="Address" formControlName="address">
      </mat-form-field>
      <mat-form-field class="w" appearance="outline">
        <input matInput placeholder="Payment (simulated)" formControlName="payment">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Place order</button>
    </form>
  </div>`,
  styles:[`.w{width:100%}`]
})
export class CheckoutPageComponent {
  total = 0;
  form;

  constructor(private fb:FormBuilder, private cart:CartService, private api:ApiService, private router:Router){
    this.form = this.fb.group({ name:['',Validators.required], address:['',Validators.required], payment:['',Validators.required] });
    this.cart.total$.subscribe(v => this.total = v);
  }

  submit(){
    const items = (this.cart as any).subject.value; // your CartService keeps items in BehaviorSubject
    const userId = Number(localStorage.getItem('userId') || 1); // TEMP until JWT profile call
    this.api.post('/orders', { userId, items, total: this.total }).subscribe((o:any) => {
      this.cart.clear();
      this.router.navigate(['/orders', o.orderId]);
    });
  }
}
