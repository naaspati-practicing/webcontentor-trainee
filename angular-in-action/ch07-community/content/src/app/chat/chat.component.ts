import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatBotService } from '../services/chat-bot.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterContentChecked {
  
  user: string;
  guest: string;
  messages: any[];
  message = '';
  @ViewChild('scrollBox') private scrollBox: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatBotServices: ChatBotService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.messages = [];
      this.user = this.userService.getUser();
      this.guest = params['username'];
    });
  }
  ngAfterContentChecked(): void {
    this.scrollToBottom();
  }
  close() {
    this.router.navigate([{outlets: {chat: null}}]);
  }
  onKeyUp(e) {
    if(e.keyCode == 13)
    this.send();
  }
  send() {
    this.addMessage(this.user, this.message, 'left');
    this.reply();
    this.message = '';
  }
  
  addMessage(user: string, message: string, type: string) {
    this.messages.push({user, message, type});
    this.scrollToBottom();
  }
  scrollToBottom() {
    try {
      const el = this.scrollBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (error) {
      console.log(error);
    }
  }

  private reply() {
    setTimeout(() => {
      this.addMessage(this.guest, this.chatBotServices.respond(), 'right');
      this.scrollToBottom();
    }, 2500);
  }

}
