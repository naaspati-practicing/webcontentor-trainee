import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './forum/forum.component';
import { ForumsComponent } from './forums/forums.component';
import { ThreadComponent } from './thread/thread.component';
import { ThreadsComponent } from './threads/threads.component';
import { ForumService } from './service/forum.service';
import { RouterModule, Route } from '@angular/router';

const routes: Route[] = [
  {path: 'forums', component: ForumsComponent},
  {
    path: 'forum/:forum_alias',
    component: ForumComponent,
    children: [
      {path: '', component: ThreadsComponent},
      {path: ':thread_alias', component: ThreadComponent},
    ]
  }
]

@NgModule({
  declarations: [
    ForumComponent, 
    ForumsComponent, 
    ThreadComponent, 
    ThreadsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ], 
  providers:[ForumService]
})
export class ForumsModule { }
