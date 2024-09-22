import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem('auth_token', token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { email, password });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  setLoginStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }
}
