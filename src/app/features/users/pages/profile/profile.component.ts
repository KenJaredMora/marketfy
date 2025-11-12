import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../../core/services/api.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  form;
  loading = signal(true);
  saving = signal(false);
  interestTags = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.nonNullable.group({
      displayName: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      bio: ['', Validators.maxLength(500)],
      interests: [''],
      email: [{ value: '', disabled: true }]
    });

    // Load user data
    this.api.get<any>('/users/me').subscribe({
      next: (u) => {
        this.form.patchValue({
          displayName: u.displayName ?? '',
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          bio: u.bio ?? '',
          interests: (u.interests ?? []).join(', '),
          email: u.email ?? ''
        });
        this.interestTags.set(u.interests ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.snackbar.show('Failed to load profile');
        this.loading.set(false);
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving.set(true);
    const v = this.form.value; // Use .value instead of .getRawValue() to exclude disabled fields

    // Build request body, explicitly excluding email
    const body = {
      displayName: v.displayName,
      firstName: v.firstName || undefined,
      lastName: v.lastName || undefined,
      bio: v.bio || undefined,
      interests: v.interests ? v.interests.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    };

    this.api.patch('/users/me', body).subscribe({
      next: () => {
        this.interestTags.set(body.interests);
        this.saving.set(false);
        this.snackbar.show('Profile updated successfully!');
      },
      error: (err) => {
        this.saving.set(false);
        const errorMsg = err?.error?.message || 'Failed to update profile';
        this.snackbar.show(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
      }
    });
  }

  removeInterest(tag: string) {
    const interests = this.form.get('interests')?.value.split(',').map((s: string) => s.trim()).filter(Boolean);
    const updated = interests?.filter((t: string) => t !== tag) || [];
    this.form.patchValue({ interests: updated.join(', ') });
  }

  get bioLength() {
    return this.form.get('bio')?.value?.length || 0;
  }
}
