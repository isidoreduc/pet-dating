import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LikedListComponent } from './liked-list/liked-list.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { // routes protected, need to authenticate to access
    path: '', runGuardsAndResolvers: "always", canActivate: [AuthGuard], children: [
      { path: 'members', component: MemberListComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: LikedListComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
