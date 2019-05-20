import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private userService: UserService,
    private router:  Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(!this.userService.isGuest())
      return true;
    else {
      this.router.navigate(['/login'], {queryParams : {returnPath: state.url}})
      return false;
    }
  }
}


