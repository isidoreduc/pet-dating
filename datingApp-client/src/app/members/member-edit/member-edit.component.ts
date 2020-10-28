import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

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
  // referencing the template reference editForm
  @ViewChild('editForm') editForm: NgForm;
  // listens for browser actions (like close button event etc.) when there are unsaved changes
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty)
      $event.returnValue = true;
  }
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
