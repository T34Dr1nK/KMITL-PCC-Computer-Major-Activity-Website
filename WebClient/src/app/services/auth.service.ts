// AuthService จัดการ Authentication & Authorization เป็นการรวมฟังก์ชันที่เกี่ยวข้องกับการตรวจสอบสิทธิ์ในที่เดียว
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development'; // Environment Variable
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // ทำให้สามารถใช้ได้ทั่วแอปโดยไม่ต้อง Import เอง
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private useMockAPI = environment.useMockAPI;

  constructor(private http: HttpClient, private router: Router) { }

  // Sign-Up API
  signUp(username: string, email: string, password: string): Observable<any> {
    if (this.useMockAPI) {
      return new Observable(observer => {
        let users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        console.log('📢 [MockAPI] Users ก่อนสมัคร: ', users);

        // Check if email is already in use
        if (users.some((user: any) => user.email === email)) {
          observer.error({ message: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
        } else {
          users.push({ username, email, password });
          localStorage.setItem('mockUsers', JSON.stringify(users));
          observer.next({ message: 'ลงทะเบียนสำเร็จ!' });
        }
        console.log('📢 [MockAPI] Users หลังสมัคร: ', users);
        observer.complete();
      }).pipe(delay(2000), catchError(this.handleError));
    }

    // ✅ API
    return this.http.post<{ message: string }>
      (`${this.apiUrl}/signup`, { username, email, password })
      .pipe(catchError(this.handleError));
  }

  // Log-In API
  login(email: string, password: string): Observable<{ token: string; role: string }> {
    return this.useMockAPI ? this.mockLogin(email, password) : this.realLogin(email, password);
  }

  private mockLogin(email: string, password: string): Observable<{ token: string; role: string }> {
    return new Observable<{ token: string; role: string }>((observer) => {
      setTimeout(() => {
        // Retrieve user data from LocalStorage
        let users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        console.log('📢 [MockAPI] Users ที่มีในระบบ:', users);

        // Verify if email and password match the stored data
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
          const token = `${user.email}-token`;
          localStorage.setItem('token', token);
          localStorage.setItem('role', 'user.role');
          observer.next({ token, role: 'user.role' });
          observer.complete();
        } else if (email === 'admin@example.com' && password === 'admin123') {
          localStorage.setItem('token', 'admin-token');
          localStorage.setItem('role', 'admin'); // Admin Role
          observer.next({ token: 'admin-token', role: 'admin' });
          observer.complete();
        } else if (email === 'user@example.com' && password === 'user123') {
          localStorage.setItem('token', 'user-token');
          localStorage.setItem('role', 'user'); // User Role
          observer.next({ token: 'user-token', role: 'user' });
          observer.complete();
        } else {
          console.log('❌ [MockAPI] Login ล้มเหลว: อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          observer.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
      }, 2000);
    }).pipe(catchError(this.handleError));
  }

  // ✅ API
  private realLogin(email: string, password: string):
    Observable<{ token: string; role: string }> {
    return this.http.post<{ token: string; role: string }>
      (`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          console.log('✅ [Real API] Login Response:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  // Logout Function
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Retrieve user role from LocalStorage
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // Handle Error Function
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMsg = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง';
    } else if (error.error?.message) {
      errorMsg = `Server Error: ${error.error.message}`;
    }

    return throwError(() => new Error(errorMsg));
  }
}