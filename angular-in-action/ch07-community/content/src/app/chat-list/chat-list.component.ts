import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../forums/service/forum.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  users: any[];
  talkTo: string;

  constructor(
    private router: Router,
    private forumService: ForumService
    
  ) { }

  ngOnInit() {
    this.users = this.forumService.users;
    console.log(this.users);
  }
  close() {
    this.router.navigate([{outlets: {chat: null}}]);
  }

}
