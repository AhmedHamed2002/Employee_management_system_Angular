import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.BASE_URL}/employee`;

  constructor(private http: HttpClient) {}

  getAllEmployees(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  createEmployee(data: FormData, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateEmployee(data: FormData, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  getEmployeeById(id: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  deleteEmployee(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  searchEmployees(query: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?query=${query}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  getHomeStats(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/home_stats`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
}

