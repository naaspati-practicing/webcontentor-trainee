import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogService } from './services/blog.service';

@NgModule({
  declarations: [
    BlogComponent, 
    BlogsComponent
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule
  ],
  providers: [BlogService]
})
export class BlogsModule { }
