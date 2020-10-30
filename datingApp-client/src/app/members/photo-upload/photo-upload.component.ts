import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IPhoto } from 'src/app/_models/photo';
import { UserService } from './../../_services/user.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @Input() photosInput: IPhoto[];
  @Output() mainPhotoOutput = new EventEmitter<string>();
  baseUrl = environment.apiUrl;
  url = `${this.baseUrl}users/${this._authServ.decodedToken.nameid}/photos`;
  token = `Bearer ${localStorage.getItem('token')}`;
  currentMainPhoto: IPhoto;

  constructor(private _authServ: AuthService, private _usersService: UserService,
    private _alertify: AlertifyService) { }

  ngOnInit(): void {
  }

  setMainPhoto = (photo: IPhoto) =>
    this._usersService.updateMainPhoto(this._authServ.decodedToken.nameid, photo.id)
      .subscribe(() => {
        this.currentMainPhoto = this.photosInput.filter(p => p.isMainPhoto)[0];
        this.currentMainPhoto.isMainPhoto = false;
        photo.isMainPhoto = true;
        // this.mainPhotoOutput.emit(photo.url);
        // subscribe to observable photoUrl
        this._authServ.changeMemberPhoto(photo.url);
        // persist change in localStorage
        this._authServ.currentUser.photoUrl = photo.url;
        localStorage.setItem('loggedUser', JSON.stringify(this._authServ.currentUser));
      }, err => console.log(err));

  deletePhoto = (photoId: number) =>
    this._alertify.confirm('Are you sure you wannna delete it?', () => {
      this._usersService.deletePhoto(this._authServ.decodedToken.nameid, photoId)
        .subscribe(() => {
          // splice - find index of item u wanna remove, how many you wanna delete
          // starting from that index
          this.photosInput.splice(this.photosInput.findIndex(p => p.id === photoId), 1);
          this._alertify.success("Photo deleted");
        }, err => console.log(err));

    });
}
