import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  returnPath = '';

  private sub: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.activeRoute.queryParams
      .subscribe(params => {
        this.returnPath = params['return'] || '/forums';
        if (!this.userService.isGuest())
          this.go();
      })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  login() {
    if (this.username && this.password) {
      this.userService.login(this.username);
      this.go();
    }
  }
  go() {
    this.router.navigateByUrl(this.returnPath);
  }
}
