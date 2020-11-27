import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery/';

import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IUser } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  user: IUser;
  images: GalleryItem[] = [];
  selectedTab: number;
  @Output() likeEvent = new EventEmitter();


  constructor(private userService: UserService, private alertify: AlertifyService,
    private router: ActivatedRoute, private authService: AuthService) { };

  ngOnInit(): void {
    // gets data from the resolver: use the same key you used in routes for resolve object (here <user>)
    this.router.data.subscribe(data =>
      this.user = data['user']);
    this.router.queryParams.subscribe(params => {
      this.selectedTab = params['tab'];
    });

    // Set gallery items array
    this.images = this.getPhotos();
  }

  getPhotos = () => {
    const imageUrls = [];
    this.user.photos.forEach(element => {
      imageUrls.push(new ImageItem({
        src: element.url,
        thumb: element.url,
      })
      );
    });
    return imageUrls;
  };

  sendLike = (id: number) =>
    this.userService.sendLike(this.authService.decodedToken.nameid, id)
      .subscribe(data => {
        this.alertify.success(`You have liked ${this.user.username.toUpperCase()}`);
      },
        err => this.alertify.error(err));
}


  // getUser = () => this.userService.getUserById(+this.route.snapshot.params['id']).subscribe(
    //   (u: IUser) => this.user = u,
    //   err => this.alertify.error(err)
    // );
