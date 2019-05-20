import { Component, OnInit } from '@angular/core';
import { Thread } from '../service/data';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  threads: Thread[];

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.threads = this.forumService.threads('forum_alias');
    });
  }
}
