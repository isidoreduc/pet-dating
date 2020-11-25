import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { IMessage } from '../_models/message';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessagesResolver implements Resolve<IMessage[]> {
  pageNumber = 1;
  pageSize = 8;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  resolve(router: ActivatedRouteSnapshot): Observable<IMessage[]> {
    return this.userService.getMessages(
      this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer)
      .pipe(
        catchError(error => {
          this.alertify.error("Problem getting messages");
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }
}
