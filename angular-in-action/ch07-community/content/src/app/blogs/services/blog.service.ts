import { Injectable } from '@angular/core';
import { data, Post } from './data';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private _posts: Post[] = data

  get posts(): Post[] {
    return this._posts;
  }
  post(id: number): Post {
    return this._posts.find(p => p.post_id === id);
  }
}
