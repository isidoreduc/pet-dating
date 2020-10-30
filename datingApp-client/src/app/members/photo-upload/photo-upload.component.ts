import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor(private _authServ: AuthService, private _usersService: UserService) { }

  ngOnInit(): void {
  }

  setMainPhoto = (photo: IPhoto) =>
    this._usersService.setMainPhoto(this._authServ.decodedToken.nameid, photo.id)
      .subscribe(() => {
        this.currentMainPhoto = this.photosInput.filter(p => p.isMainPhoto)[0];
        this.currentMainPhoto.isMainPhoto = false;
        photo.isMainPhoto = true;
        this.mainPhotoOutput.emit(photo.url);
      }, err => console.log(err));


}
