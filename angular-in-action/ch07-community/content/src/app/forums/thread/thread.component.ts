import { Component, OnInit } from '@angular/core';
import { Thread, Forum } from '../service/data';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  forum: Forum;
  thread: Thread;

  constructor(
    private route: ActivatedRoute, 
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let forum = this.route.snapshot.parent.params['forum_alias'];
      this.thread = this.forumService.thread(forum, params['thread_alias']);
    });
  }

}
