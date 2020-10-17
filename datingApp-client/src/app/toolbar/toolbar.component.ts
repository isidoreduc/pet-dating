import { Component, OnInit } from '@angular/core';

import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isLogin: boolean;

  constructor(public dialog: MatDialog) { }

  openLoginDialog(): void {
    this.isLogin = true;
    this.dialog.open(LoginDialogComponent, {
      width: '350px', height: '450px',
      data: { isLogin: this.isLogin } // pass data to dialog
    });
  }

  openRegisterDialog(): void {
    this.isLogin = false;
    this.dialog.open(LoginDialogComponent, {
      width: '350px', height: '450px',
      data: { isLogin: this.isLogin }
    });
  }

  // !! is short for if(localStorage.getItem('token') !== null) return true else return false
  loggedIn = (): boolean => !!localStorage.getItem('token');

  logout = () => localStorage.removeItem('token');

  ngOnInit(): void {
  }

}
