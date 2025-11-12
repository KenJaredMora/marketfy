import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { jwtDecode } from 'jwt-decode';        // 🔸 named export
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface LoginDTO { email: string; password: string; }
export interface RegisterDTO { email: string; password: string; displayName: string; }
export interface JwtPayload { sub: string; email: string; exp: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private api: ApiService) {}

  // return observable; do side-effects in tap
  login(dto: LoginDTO): Observable<{ access_token: string; userId?: number }> {
    return this.api.post<{ access_token: string; userId?: number }>('/auth/login', dto).pipe(
      tap(({ access_token, userId }) => {
        this.token.set(access_token);
        localStorage.setItem('token', access_token);
        if (userId) localStorage.setItem('userId', String(userId));
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
}
