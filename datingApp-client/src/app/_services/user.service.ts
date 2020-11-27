import { HttpClient, HttpParams } from '@angular/common/http';

import { IMessage } from './../_models/message';
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

  getUsers = (page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<IUser[]>> => {
    const paginatedResult: PaginatedResult<IUser[]> = new PaginatedResult<IUser[]>();
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers')
      params = params.append('likers', 'true');

    if (likesParam === 'Likees')
      params = params.append('likees', 'true');


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

  sendLike = (id: number, recipientId: number) =>
    this.http.post(`${this.baseUrl}users/${id}/like/${recipientId}`, {});

  unLikeUser = (id: number, recipientId: number) =>
    this.http.delete(`${this.baseUrl}users/${id}/like/${recipientId}`, {});





  getMessages = (id: number, page?, itemsPerPage?, messageContainer?): Observable<PaginatedResult<IMessage[]>> => {
    const paginatedResult: PaginatedResult<IMessage[]> = new PaginatedResult<IMessage[]>();
    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<IMessage[]>(`${this.baseUrl}users/${id}/messages`, { observe: 'response', params })
      .pipe(map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null)
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        return paginatedResult;
      }));
  };


  getMessageThread = (id: number, recipientId: number) =>
    this.http.get<IMessage[]>(`${this.baseUrl}users/${id}/messages/thread/${recipientId}`);

  sendMessage = (id: number, message: IMessage) =>
    this.http.post(`${this.baseUrl}users/${id}/messages`, message);

  deleteMessage = (id: number, userId: number) =>
    this.http.post(`${this.baseUrl}users/${userId}/messages/${id}`, {});

  markAsRead = (userId: number, messageId: number) =>
    this.http.post(`${this.baseUrl}users/${userId}/messages/${messageId}/read`, {}).subscribe();
}
