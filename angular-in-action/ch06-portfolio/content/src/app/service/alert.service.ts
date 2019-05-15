import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  show = false;
  type = 'info';
  message: string;
  timer: any;

  alert(message: string, type = 'info', autohide = 5000) {
    this.show = true;
    this.type = type;
    this.message = message;
    if (this.timer)
      clearTimeout(this.timer);
    if (autohide)
      this.timer = setTimeout(() => this.close(), autohide);
  }
  close(): void {
    this.show = false;
  }

  constructor() { }
}
