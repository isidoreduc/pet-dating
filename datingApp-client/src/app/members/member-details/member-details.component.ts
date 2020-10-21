import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { IUser } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {
  user: IUser;
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser = () => this.userService.getUserById(+this.route.snapshot.params['id']).subscribe(
    (u: IUser) => this.user = u,
    err => this.alertify.error(err)
  );

}
