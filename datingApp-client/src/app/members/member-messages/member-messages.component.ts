import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IMessage } from './../../_models/message';
import { UserService } from './../../_services/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {
  @Input() recipientId: number;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messages: IMessage[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService,
    private alertifyService: AlertifyService) { }


  ngOnInit(): void {
    this.loadMessages();
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages = () => {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(
      this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          for (let index = 0; index < messages.length; index++) {
            if (messages[index].isRead === false &&
              messages[index].recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, messages[index].id);
            }
          }
        })
      )
      .subscribe(messages => this.messages = messages, err => this.alertifyService.error(err));
  };


  sendMessage = () => {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: IMessage) => {
        // add new message to beginning of messages array
        // this.messages.unshift(message);
        this.messages.push(message);
        // reset new message content
        this.newMessage.content = '';
      }, err => this.alertifyService.error(err));

  };


  private scrollToBottom = () => {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
