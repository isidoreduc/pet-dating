import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/_models/user';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user: IUser;
  constructor(private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.data.subscribe(next =>
      this.user = next['user'],
      err => console.log(err)
    );
  }

}
