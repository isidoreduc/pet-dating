import { Component, OnInit } from '@angular/core';
import { IPagination, PaginatedResult } from 'src/app/_models/pagination';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IUser } from './../../_models/user';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-liked-list',
  templateUrl: './liked-list.component.html',
  styleUrls: ['./liked-list.component.scss']
})
export class LikedListComponent implements OnInit {
  users: IUser[];
  pagination: IPagination;
  likesParam: string;

  constructor(private _authServ: AuthService, private _userServ: UserService,
    private _alertifyServ: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  loadUsers = () =>
    this._userServ.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe((res: PaginatedResult<IUser[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, err => console.log(err));

  changePage = (event: PageEvent) => {
    this.pagination.currentPage = event.pageIndex + 1;
    this.pagination.itemsPerPage = event.pageSize;
    this.loadUsers();
  };

}
