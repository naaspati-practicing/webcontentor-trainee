import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent {
  @Output() onRefresh = new EventEmitter<void>();
  refresh() {
    this.onRefresh.emit();
  }
}
