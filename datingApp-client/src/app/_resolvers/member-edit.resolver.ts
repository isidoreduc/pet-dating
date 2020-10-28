import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { IUser } from 'src/app/_models/user';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MemberEditResolver implements Resolve<IUser> {
  constructor(private userService: UserService, private route: Router,
    private alertify: AlertifyService, private authService: AuthService) { }

  resolve(router: ActivatedRouteSnapshot): Observable<IUser> {
    return this.userService.getUserById(this.authService.decodedToken.nameid).pipe(
      catchError(error => {
        this.alertify.error("Problem getting your user");
        this.route.navigate(['/members']);
        return of(null);
      })
    );
  }
}
