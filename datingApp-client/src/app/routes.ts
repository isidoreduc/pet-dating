import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LikedListComponent } from './liked-list/liked-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberDetailsResolver } from './_resolvers/member-details.resolver';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MessagesComponent } from './messages/messages.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { // routes protected, need to authenticate to access
    path: '', runGuardsAndResolvers: "always", canActivate: [AuthGuard], children: [
      {
        path: 'members', component: MemberListComponent,
        resolve: { users: MemberListResolver }
      },
      {
        path: 'members/:id', component: MemberDetailsComponent,
        resolve: { user: MemberDetailsResolver }
      },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: LikedListComponent },

    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
