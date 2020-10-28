import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { IUser } from 'src/app/_models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user: IUser;
  @ViewChild('editForm') editForm: NgForm;
  constructor(private router: ActivatedRoute, private _alertify: AlertifyService) { }

  ngOnInit(): void {
    this.router.data.subscribe(next =>
      this.user = next['user'],
      err => console.log(err)
    );
  }

  updateUser() {
    console.log(this.user);
    this._alertify.success("Changes saved successfully");
    this.editForm.reset(this.user);
  }

}
