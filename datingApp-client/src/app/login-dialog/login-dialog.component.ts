import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';


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
    @Inject(MAT_DIALOG_DATA) public data: any) { } // injecting data from toolbar


  onNoClick(): void {
    this.dialogRef.close();
  }

  login = () =>
    this.authService.login(this.model)
      .subscribe(
        () => this.dialogRef.close(),
        error => console.log(error)
      );



  register = () => this.authService.register(this.model)
    .subscribe(() => {
      console.log("register complete");
      this.dialogRef.close();
    }, error => console.log(error));
}
