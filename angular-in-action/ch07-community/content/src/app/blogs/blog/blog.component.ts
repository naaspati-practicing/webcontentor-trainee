import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Post } from '../services/data';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  post: Post;
  post_id: number;
  lines: string[];
  canNext = true;
  canPrev = true;
  
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.post_id = parseInt(params['post_id']);
      this.post = this.blogService.post(this.post_id);
      this.lines = this.post.content.split('\n').filter(line => line.length);
      this.canPrev = this.post_id > 1;
      this.canNext = this.post_id < this.blogService.posts.length;
    });
  }

}
