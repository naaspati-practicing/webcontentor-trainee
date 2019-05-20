import { Component, OnInit } from '@angular/core';
import { Post } from '../services/data';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  posts: Post[];

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.posts = this.blogService.posts;
  }

}
