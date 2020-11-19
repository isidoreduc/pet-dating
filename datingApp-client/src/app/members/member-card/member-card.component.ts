import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IUser } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() member: IUser;
  // disabled = false;
  @Input() isLikedList: boolean;
  @Output() loadUsers = new EventEmitter();



  constructor(private _userService: UserService, private _authService: AuthService,
    private _alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike = (id: number) =>
    this._userService.sendLike(this._authService.decodedToken.nameid, id)
      .subscribe(data => {
        this._alertify.success(`You have liked ${this.member.username.toUpperCase()}`);
      },
        err => this._alertify.error(err));


  unLikeUser = (id: number) =>
    this._userService.unLikeUser(this._authService.decodedToken.nameid, id)
      .subscribe(data => {
        this._alertify.success(`You have unliked ${this.member.username.toUpperCase()}`);
        // need an event to reload likes list after delete
        this.loadUsers.emit(null);
      },
        err => this._alertify.error(err));

}
