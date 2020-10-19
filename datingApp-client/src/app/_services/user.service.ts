import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IUser } from './../_models/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Temporary way to get the token auth
const options = {
  headers: new HttpHeaders(
    {
      'authorization': `Bearer ${localStorage.getItem('token')}`
    })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers = (): Observable<IUser[]> => this.http.get<IUser[]>(`${this.baseUrl}users`, options);

  getUserById = (id: number): Observable<IUser> => this.http.get<IUser>(`${this.baseUrl}users/${id}`, options);
}
