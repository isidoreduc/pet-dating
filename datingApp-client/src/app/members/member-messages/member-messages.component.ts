import { Component, Input, OnInit } from '@angular/core';

import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { IMessage } from './../../_models/message';
import { UserService } from './../../_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: IMessage[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService,
    private alertifyService: AlertifyService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages = () => this.userService.getMessageThread(
    this.authService.decodedToken.nameid, this.recipientId)
    .subscribe(messages => this.messages = messages, err => this.alertifyService.error(err));

  sendMessage = () => {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: IMessage) => {
        // add new message to beginning of messages array
        this.messages.unshift(message);
        // reset new message content
        this.newMessage.content = '';
      }, err => this.alertifyService.error(err));

  };
}
