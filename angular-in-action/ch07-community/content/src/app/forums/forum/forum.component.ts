import { Component, OnInit } from '@angular/core';
import { Forum } from '../service/data';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../service/forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forum: Forum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.forum = this.forumService.forum(params['forum_alias']);
        if (!this.forum)
          this.router.navigate(['/not-found']);
      });
  }

}
