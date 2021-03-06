import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from './../_services/alertify.service';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  hide = true;
  registerForm = new FormGroup({});
  user: any = {};


  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private alerify: AlertifyService, private router: Router) { } // injecting data from toolbar

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        gender: ['Girl'],
        knownAs: ['', [Validators.required]],
        dateOfBirth: [null, [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null :
      { 'mismatch': true };
  }


  onNoClick(): void {
    this.dialogRef.close();
  };

  login = () =>
    this.authService.login(this.user)
      .subscribe(
        result => {
          // this.userName = this.model.username;
          this.dialogRef.close();
          this.router.navigate(['/members']);
          this.alerify.success("Logged in successfully");
        },
        error => this.alerify.error(error)
      );



  register = () => {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user)
        .subscribe(() => {
          this.alerify.success("Registration Complete");
          this.dialogRef.close();
          this.authService.login(this.user).subscribe(() =>
            this.router.navigate(['/members'])
          );
        },
          error => this.alerify.error(error));
    }
    // console.log(this.registerForm.value);
  };


}
