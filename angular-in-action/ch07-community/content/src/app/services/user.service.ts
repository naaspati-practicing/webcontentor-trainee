import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const USERNAME_KEY = 'username';
let username = localStorage.getItem(USERNAME_KEY) || '';
let guest = !username ;

@Injectable()
export class UserService {
  constructor(
    private router: Router
  ) { }

  getUser() {
    return username;
  }

  login(userName: string) {
    username = userName;
    guest = false;
    localStorage.setItem(USERNAME_KEY, username);
  }
  isGuest():boolean {
    return guest;
  }
  logout() {
    username = '';
    guest = true;
    localStorage.setItem(USERNAME_KEY, username);
    this.router.navigate([{outlets: {chat: null}}]);
  }
}
