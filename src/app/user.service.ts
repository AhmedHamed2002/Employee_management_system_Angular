import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.BASE_URL}/user`;

  constructor(private http: HttpClient) {}


  register(data: FormData): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/login`, credentials);
  }

  checkToken() {
  const token = localStorage.getItem('EMS_token');
    return this.http.get<any>(`${this.api}/check`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  profile(): Observable<any> {
    const token = localStorage.getItem('EMS_token');
    return this.http.get(`${this.api}/profile` , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateProfile(data: FormData): Observable<any> {
    const token = localStorage.getItem('EMS_token');
    return this.http.put(`${this.api}/profile`, data , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('EMS_token');
    return this.http.get(`${this.api}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.api}/forgot-password`, { email });
  }

  resetPassword(payload: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.api}/reset-password`, payload);
  }
}
