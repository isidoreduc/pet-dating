import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IUser } from 'src/app/_models/user';
import { NgForm } from '@angular/forms';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user: IUser;
  photoUrl: string;
  // referencing the template reference editForm
  @ViewChild('editForm') editForm: NgForm;
  // listens for browser actions (like close button event etc.) when there are unsaved changes
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty)
      $event.returnValue = true;
  }
  constructor(private router: ActivatedRoute, private _alertify: AlertifyService,
    private _userService: UserService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.router.data.subscribe(next =>
      this.user = next['user'],
      err => console.log(err)
    );
    this._authService.currentPhotoUrl.subscribe(cpu =>
      this.photoUrl = cpu, err => console.log(err));
  }

  updateUser() {
    this._userService.editUser(this._authService.decodedToken.nameid, this.user)
      .subscribe(next => {
        this._alertify.success("Changes saved successfully");
        this.editForm.reset(this.user);
      }, err => this._alertify.error(err));
  }

  // recent first
  getPhotosSortedByDateAdded = () =>
    this.user.photos.sort((a, b) => 0 - (a.dateAdded > b.dateAdded ? 1 : -1));

  getNewMainPhoto = (event: string) => {
    this.user.photoUrl = event;
  };

  // Ascending
  // values.sort((a,b) => 0 - (a > b ? -1 : 1));

  // Descending
  //values.sort((a,b) => 0 - (a > b ? 1 : -1));
}
