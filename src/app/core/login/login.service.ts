import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private route: Router) { }

  apiUrl = environment.baseUrl

  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLogedIn() {
    return this.getToken() !== null;
  }

  loginUser(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + '/admin/login', params, { headers: headers });
  }

  resetPassword(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + '/admin/resetPassword', params, { headers: headers });
  }

  updatePassword(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + '/admin/changePassword', params, { headers: headers });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
    localStorage.removeItem('notifyToken');
    this.route.navigateByUrl('/login');
  }


}
