import { Component, OnInit } from '@angular/core';
import { Forum } from '../service/data';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  forums: Forum[];

  constructor(
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.forums = this.forumService.forums;
  }

}
