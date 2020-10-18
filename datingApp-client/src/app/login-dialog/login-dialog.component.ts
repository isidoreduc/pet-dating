import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from './../_services/alertify.service';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  model: any = {};
  hide = true;


  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alerify: AlertifyService, private router: Router) { } // injecting data from toolbar


  onNoClick(): void {
    this.dialogRef.close();
  }

  login = () =>
    this.authService.login(this.model)
      .subscribe(
        () => {
          this.dialogRef.close();
          this.router.navigate(['/members']);
          this.alerify.success("Logged in successfully");
        },
        error => this.alerify.error(error)
      );



  register = () => this.authService.register(this.model)
    .subscribe(() => {
      this.alerify.success("Registration Complete");
      this.dialogRef.close();
    }, error => this.alerify.error(error));
}
