import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  // 🔸 remove providers: [AuthService] to avoid a new instance
  template: `
  <div style="max-width:420px;margin:auto;padding:16px">
    <h2>Login</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="w">
        <input matInput placeholder="Email" formControlName="email">
      </mat-form-field>
      <mat-form-field appearance="outline" class="w">
        <input matInput type="password" placeholder="Password" formControlName="password">
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Login</button>
      <a routerLink="/auth/register" style="margin-left:12px">Create account</a>
    </form>
  </div>`,
  styles:[`.w{width:100%}`]
})
export class LoginComponent {
  // type-safe, non-nullable form
  form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    this.auth.login({ email, password }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {/* optionally show a snackbar/toast */},
    });
  }
}
