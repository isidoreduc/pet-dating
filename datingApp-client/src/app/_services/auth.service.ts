import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = `${environment.apiUrl}auth/`;
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login = (model: any) =>
    this.http.post(`${this.baseUrl}login`, model).pipe(
      map((response: any) => {
        if (response !== null) {
          localStorage.setItem('token', response.token);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
        }
      })
    );


  register = (model: any) =>
    this.http.post(`${this.baseUrl}register`, model);

  loggedIn = (): boolean =>
    !this.jwtHelper.isTokenExpired(localStorage.getItem("token"));


}
