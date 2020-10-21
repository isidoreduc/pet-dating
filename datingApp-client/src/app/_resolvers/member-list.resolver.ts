import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AlertifyService } from '../_services/alertify.service';
import { IUser } from 'src/app/_models/user';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MemberListResolver implements Resolve<IUser[]> {
  constructor(private userService: UserService, private router: Router,
    private alertify: AlertifyService) { }

  resolve(router: ActivatedRouteSnapshot): Observable<IUser[]> {
    return this.userService.getUsers().pipe(
      catchError(error => {
        this.alertify.error("Problem getting users");
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
