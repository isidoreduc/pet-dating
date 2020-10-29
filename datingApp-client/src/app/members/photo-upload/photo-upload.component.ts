import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from './../../_services/auth.service';
import { IPhoto } from 'src/app/_models/photo';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @Input() photosInput: IPhoto[];
  baseUrl = environment.apiUrl;
  url = `${this.baseUrl}users/${this._authServ.decodedToken.nameid}/photos`;
  token = `Bearer ${localStorage.getItem('token')}`;

  constructor(private _authServ: AuthService) { }

  ngOnInit(): void {
  }

}
