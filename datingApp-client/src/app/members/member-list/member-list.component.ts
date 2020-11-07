import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { IPagination } from 'src/app/_models/pagination';
import { IUser } from '../../_models/user';
import { PageEvent } from '@angular/material/paginator';
import { PaginatedResult } from './../../_models/pagination';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members: IUser[];
  pagination: IPagination;
  pageEvent: PageEvent;

  constructor(private userService: UserService, private alertify: AlertifyService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.members = data['users'].result;
      this.pagination = data['users'].pagination;
    });
  }

  loadUsers = () =>
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<IUser[]>) => {
        this.members = res.result;
        this.pagination = res.pagination;
      }, err => console.log(err));

  changePage = (event: PageEvent) => {
    this.pagination.currentPage = event.pageIndex + 1;
    this.pagination.itemsPerPage = event.pageSize;
    this.loadUsers();
  };

}
