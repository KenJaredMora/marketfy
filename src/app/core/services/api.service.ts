import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000'; // or environment.apiBase

  get<T>(url: string, params?: any) {
    return this.http.get<T>(`${this.base}${url}`, { params });
  }
  post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.base}${url}`, body);
  }
  patch<T>(url: string, body: any) {
    return this.http.patch<T>(`${this.base}${url}`, body);
  }
  put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.base}${url}`, body);
  }
  delete<T>(url: string) {
    return this.http.delete<T>(`${this.base}${url}`);
  }
}
