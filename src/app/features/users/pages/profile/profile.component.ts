import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="max-width:720px;margin:auto;padding:16px">
    <h2>My Profile</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field class="w" appearance="outline"><input matInput placeholder="Display name" formControlName="displayName"></mat-form-field>
      <mat-form-field class="w" appearance="outline"><input matInput placeholder="First name" formControlName="firstName"></mat-form-field>
      <mat-form-field class="w" appearance="outline"><input matInput placeholder="Last name" formControlName="lastName"></mat-form-field>
      <mat-form-field class="w" appearance="outline"><textarea matInput placeholder="Bio" formControlName="bio"></textarea></mat-form-field>
      <mat-form-field class="w" appearance="outline"><input matInput placeholder="Areas of interest (comma separated)" formControlName="interests"></mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
    </form>
  </div>`,
  styles:[`.w{width:100%}`]
})
export class ProfileComponent {
  form;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.nonNullable.group({
      displayName: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      bio: [''],
      interests: [''],
    });
    this.api.get<any>('/users/me').subscribe(u => {
      this.form.patchValue({
        displayName: u.displayName ?? '',
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        bio: u.bio ?? '',
        interests: (u.interests ?? []).join(', '),
      });
    });
  }
  save() {
    const v = this.form.getRawValue();
    const body = { ...v, interests: v.interests.split(',').map(s => s.trim()).filter(Boolean) };
    this.api.patch('/users/me', body).subscribe();
  }
}
