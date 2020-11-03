import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from './../../_services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { IPhoto } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.scss']
})
export class PhotoUploaderComponent implements OnInit {
  @Input() URL: string;
  @Input() TOKEN: string;
  @Input() PHOTOS: IPhoto[];
  // @Input() AUTHSERV: AuthService;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private _authServ: AuthService) { }

  ngOnInit(): void {
    this.initializeUploader();
  }


  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.URL,
      authToken: this.TOKEN,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: IPhoto = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMainPhoto: res.isMainPhoto
        };
        this.PHOTOS.push(photo);
        // if photo we just pushed is the only one, then it is main, so it should be all over
        if (this.PHOTOS.length === 1) {
          photo.isMainPhoto = true;
          this._authServ.changeMemberPhoto(photo.url);
          this._authServ.currentUser.photoUrl = photo.url;
          localStorage.setItem('loggedUser', JSON.stringify(this._authServ.currentUser));
        }
      }
    };
  }




}
