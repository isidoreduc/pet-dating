import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { IUser } from '../../_models/user';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members: IUser[];
  constructor(private userService: UserService, private alertify: AlertifyService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data =>
      this.members = data['users']);
  }

  // getMembers = () => this.userService.getUsers().subscribe(
  //   (membs: IUser[]) => this.members = membs,
  //   err => this.alertify.error(err)
  // );

}
