import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "http://localhost:5000/api/auth";
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login = (model: any) =>
    this.http.post(`${this.baseUrl}/login`, model).pipe(
      map((response: any) => {
        if (response !== null) {
          localStorage.setItem('token', response.token);
        }
      })
    );


  register = (model: any) =>
    this.http.post(`${this.baseUrl}/register`, model);

  loggedIn = (): boolean =>
    !this.jwtHelper.isTokenExpired(localStorage.getItem("token"));


}
