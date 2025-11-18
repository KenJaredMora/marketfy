import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  template: `
  <div style="max-width:420px;margin:auto;padding:16px">
    <h2>Create account</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="w">
        <mat-label>Display Name</mat-label>
        <input matInput placeholder="Enter your display name" formControlName="displayName">
        <mat-error *ngIf="form.get('displayName')?.hasError('required')">
          Display name is required
        </mat-error>
        <mat-error *ngIf="form.get('displayName')?.hasError('minlength')">
          Display name must be at least 2 characters
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w">
        <mat-label>Email</mat-label>
        <input matInput type="email" placeholder="Enter your email" formControlName="email">
        <mat-error *ngIf="form.get('email')?.hasError('required')">
          Email is required
        </mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">
          Please enter a valid email address
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w">
        <mat-label>Password</mat-label>
        <input matInput type="password" placeholder="Enter your password" formControlName="password">
        <mat-error *ngIf="form.get('password')?.hasError('required')">
          Password is required
        </mat-error>
        <mat-error *ngIf="form.get('password')?.hasError('minlength')">
          Password must be at least 6 characters
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w">
        <mat-label>Confirm Password</mat-label>
        <input matInput type="password" placeholder="Confirm your password" formControlName="confirmPassword">
        <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">
          Please confirm your password
        </mat-error>
        <mat-error *ngIf="form.get('confirmPassword')?.hasError('passwordMismatch')">
          Passwords do not match
        </mat-error>
      </mat-form-field>

      @if (errorMessage) {
        <div style="color:#f44336;margin-bottom:12px;font-size:14px">
          {{ errorMessage }}
        </div>
      }

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>
      <a routerLink="/auth/login" style="margin-left:12px">Already have an account? Login</a>
    </form>
  </div>`,
  styles:[`.w{width:100%;margin-bottom:12px}`]
})
export class RegisterComponent {
  form;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { displayName, email, password } = this.form.getRawValue();

    this.auth.register({ displayName, email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        // Handle specific error messages from backend
        if (err.error?.message) {
          this.errorMessage = Array.isArray(err.error.message)
            ? err.error.message.join(', ')
            : err.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
