import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({ providedIn:'root' })
export class SnackbarService {
  private snack = inject(MatSnackBar);
  open(msg:string){ this.snack.open(msg,'Close',{ duration:3000 }); }
  show(msg:string){ this.open(msg); } // Alias for consistency
}
