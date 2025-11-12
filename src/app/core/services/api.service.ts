// src/app/core/services/api.service.ts
import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type ApiQuery =
  | Record<string, string | number | boolean | null | undefined>
  | undefined;

export interface ApiOptions {
  headers?: HttpHeaders | Record<string, string>;
  params?: ApiQuery;
}

/**
 * Thin API wrapper:
 * - Uses environment.apiBase
 * - Strong typing with <T>
 * - Accepts optional params/headers
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBase?.replace(/\/+$/, '') || '';

  private buildUrl(url: string): string {
    // ensure single slash between base and url
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${this.base}${path}`;
  }

  private toHttpParams(params?: ApiQuery): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) continue;
      hp = hp.set(k, String(v));
    }
    return hp;
  }

  get<T>(url: string, params?: ApiQuery, options?: ApiOptions) {
    return this.http.get<T>(this.buildUrl(url), {
      params: this.toHttpParams(params ?? options?.params),
      headers: options?.headers,
    });
  }

  post<T>(url: string, body: unknown, options?: ApiOptions) {
    return this.http.post<T>(this.buildUrl(url), body, {
      params: this.toHttpParams(options?.params),
      headers: options?.headers,
    });
  }

  put<T>(url: string, body: unknown, options?: ApiOptions) {
    return this.http.put<T>(this.buildUrl(url), body, {
      params: this.toHttpParams(options?.params),
      headers: options?.headers,
    });
  }

  patch<T>(url: string, body: unknown, options?: ApiOptions) {
    return this.http.patch<T>(this.buildUrl(url), body, {
      params: this.toHttpParams(options?.params),
      headers: options?.headers,
    });
  }

  delete<T>(url: string, params?: ApiQuery, options?: ApiOptions) {
    return this.http.delete<T>(this.buildUrl(url), {
      params: this.toHttpParams(params ?? options?.params),
      headers: options?.headers,
    });
  }
}
