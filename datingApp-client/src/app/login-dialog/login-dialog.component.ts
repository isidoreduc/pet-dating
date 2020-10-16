import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  model: any = {};
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  login() {
    console.log(this.model);
    this.dialogRef.close();
  }
}
