import { Component, Input, OnInit } from '@angular/core';

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

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor() { }

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
        this.PHOTOS.push(res);
      }
    };
  }




}
