import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LikedListsComponent } from './liked-lists/liked-lists.component';
import { MemberListsComponent } from './member-lists/member-lists.component';
import { MessagesComponent } from './messages/messages.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { // routes protected, need to authenticate to access
    path: '', runGuardsAndResolvers: "always", canActivate: [AuthGuard], children: [
      { path: 'members', component: MemberListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: LikedListsComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
