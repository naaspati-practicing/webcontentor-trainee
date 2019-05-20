import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { FormsModule } from '@angular/forms';
import { ForumsModule } from './forums/forums.module';
import { UserService } from './services/user.service';
import { BlogsModule } from './blogs/blogs.module';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: ChatListComponent, outlet: 'chat', canActivate: [AuthGuardService] },
  { path: 'users/:username', component: ChatComponent, outlet: 'chat', canActivate: [AuthGuardService] },
  { path: 'blogs', loadChildren: './blogs/blogs.module#BlogsModule' },
  { path: '', redirectTo: '/forums', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    ChatComponent,
    ChatListComponent
  ],
  imports: [
    ForumsModule,
    FormsModule,
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuardService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
