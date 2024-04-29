import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@ibk/env/environment";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthResponse, RegisterRequest, User } from "@ibk/core/interfaces";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isBrowser: boolean = false;
  user$ = new BehaviorSubject<User | undefined>(this.getUser());

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(body: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ environment.urlApi }/auth/login`, body).pipe(
      tap(res => this.setToken(res))
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ environment.urlApi }/auth/register`, body).pipe(
      tap(res => this.setToken(res))
    );
  }

  logout(): void {
    this.removeToken();
    this.user$.next(undefined);
  }

  getUser(): User | undefined {
    if (this.token) {
      return this.parseJwt(this.token);
    } else {
      return undefined;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  get token() {
    if (!this.isBrowser) return '';
    return localStorage.getItem('token');
  }

  setToken(body: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem('token', body.token);
    }
    const user = this.parseJwt(body.token);
    this.user$.next(user);
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  private parseJwt(token: string) {
    if (!token) return undefined;
    const [, base64Url] = token.split('.');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

}
