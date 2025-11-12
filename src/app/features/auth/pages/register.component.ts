import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="max-width:420px;margin:auto;padding:16px">
    <h2>Create account</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="w">
        <input matInput placeholder="Display name" formControlName="displayName">
      </mat-form-field>
      <mat-form-field appearance="outline" class="w">
        <input matInput placeholder="Email" formControlName="email">
      </mat-form-field>
      <mat-form-field appearance="outline" class="w">
        <input matInput type="password" placeholder="Password" formControlName="password">
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Register</button>
    </form>
  </div>`,
  styles:[`.w{width:100%}`]
})
export class RegisterComponent {
  form;
  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router) {
    this.form = this.fb.group({
      displayName:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
    });
  }
  submit(){ this.auth.register(this.form.value as any).subscribe(() => this.router.navigate(['/auth/login'])); }
}
