import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from './../_models/user';
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
  currentUser: IUser;
  $photoUrl = new BehaviorSubject<string>('');
  currentPhotoUrl = this.$photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto = (photoUrl: string) =>
    this.$photoUrl.next(photoUrl);

  login = (model: any) =>
    this.http.post(`${this.baseUrl}login`, model).pipe(
      map((response: any) => {
        if (response !== null) {
          localStorage.setItem('token', response.token);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
          localStorage.setItem('loggedUser', JSON.stringify(response.loggedUser));
          this.currentUser = response.loggedUser;

          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );


  register = (user: IUser) =>
    this.http.post(`${this.baseUrl}register`, user);

  loggedIn = (): boolean =>
    !this.jwtHelper.isTokenExpired(localStorage.getItem("token"));


}
