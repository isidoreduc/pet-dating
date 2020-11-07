import { HttpClient, HttpParams } from '@angular/common/http';

import { IUser } from './../_models/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from './../_models/pagination';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers = (page?, itemsPerPage?): Observable<PaginatedResult<IUser[]>> => {
    const paginatedResult: PaginatedResult<IUser[]> = new PaginatedResult<IUser[]>();
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('PageSize', itemsPerPage);
    }
    return this.http.get<IUser[]>(`${this.baseUrl}users`, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null)
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        return paginatedResult;
      })
    );
  };

  getUserById = (id: number): Observable<IUser> =>
    this.http.get<IUser>(`${this.baseUrl}users/${id}`);

  editUser = (id: number, user: IUser) => this.http.put(`${this.baseUrl}users/${id}`, user);

  updateMainPhoto = (userId: number, photoId: number) =>
    this.http.post(`${this.baseUrl}users/${userId}/photos/${photoId}/setMain`, {});

  deletePhoto = (userId: number, photoId: number) =>
    this.http.delete(`${this.baseUrl}users/${userId}/photos/${photoId}`);


}
