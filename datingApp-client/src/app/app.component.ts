import { Component, OnInit } from '@angular/core';

import { AuthService } from './_services/auth.service';
import { IUser } from './_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeUserNameDecoder();
  }

  // now at reload, the template will have the username to display with Hi,
  initializeUserNameDecoder = () => {
    const token = localStorage.getItem("token");
    const user: IUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
    }
  };
}
