import { Injectable, Injector, inject, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface LoginDTO { email: string; password: string; }
export interface RegisterDTO { email: string; password: string; displayName: string; }
export interface JwtPayload { sub: string; email: string; exp: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem('token'));
  private api = inject(ApiService);
  private injector = inject(Injector);

  // return observable; do side-effects in tap
  login(dto: LoginDTO): Observable<{ access_token: string; userId?: number }> {
    return this.api.post<{ access_token: string; userId?: number }>('/auth/login', dto).pipe(
      tap(({ access_token, userId }) => {
        this.token.set(access_token);
        localStorage.setItem('token', access_token);
        if (userId) localStorage.setItem('userId', String(userId));
        // Reload cart for the new user
        this.reloadUserData();
      })
    );
  }

  register(dto: RegisterDTO) {
    return this.api.post('/auth/register', dto);
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Clear cart when logging out
    this.reloadUserData();
  }

  isAuthenticated(): boolean {
    const t = this.token();
    if (!t) return false;
    try {
      const payload = jwtDecode<JwtPayload>(t);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Reload user-specific data (cart) when user changes
  private reloadUserData() {
    // Use dynamic import to avoid circular dependency
    import('../../features/cart/cart.service').then(({ CartService }) => {
      const cartService = this.injector.get(CartService);
      cartService.reloadCart();
    });
  }
}
