import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  model: any = {};
  hide = true;


  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { } // injecting data from toolbar


  onNoClick(): void {
    this.dialogRef.close();
  }

  login() {
    console.log(this.model);
    this.dialogRef.close();
  }
}
