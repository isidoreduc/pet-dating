import { Component, Input, OnInit } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.scss']
})
export class PhotoUploaderComponent implements OnInit {
  @Input() URL: string;
  @Input() TOKEN: string;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  response = '';

  constructor() { }

  ngOnInit(): void {
    this.initializeUploader();
    this.uploader.response.subscribe(res => this.response = res);
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
  }




}
