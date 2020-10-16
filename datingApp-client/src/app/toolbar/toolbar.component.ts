import { Component, OnInit } from '@angular/core';

import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {


  constructor(public dialog: MatDialog) { }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '450px',
    });
  }

  ngOnInit(): void {
  }

}
