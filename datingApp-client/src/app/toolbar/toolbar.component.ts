import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { IUser } from './../_models/user';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../_services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isLogin: boolean;
  user: IUser;


  constructor(public dialog: MatDialog, private alertify: AlertifyService,
    public authService: AuthService, private router: Router, private userService: UserService,
    private activatedRoute: ActivatedRoute) { }



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
  // loggedIn = (): boolean => !!localStorage.getItem('token');
  loggedIn = (): boolean => this.authService.loggedIn();

  logout = () => {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.user = null;
    this.alertify.message("Logged out successfully");
  };





  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(data =>
    //   this.user = data['user']);



  }


}
