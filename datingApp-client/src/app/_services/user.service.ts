import { HttpClient } from '@angular/common/http';
import { IUser } from './../_models/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers = (): Observable<IUser[]> =>
    this.http.get<IUser[]>(`${this.baseUrl}users`);

  getUserById = (id: number): Observable<IUser> =>
    this.http.get<IUser>(`${this.baseUrl}users/${id}`);

  editUser = (id: number, user: IUser) => this.http.put(`${this.baseUrl}users/${id}`, user);
}
