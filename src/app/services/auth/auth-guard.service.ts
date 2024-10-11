import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { TestsService } from '../tests.service';
import { SessionService } from '../session.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, private testsService: TestsService, private session: SessionService) { }
  
  canActivate(): boolean {
    
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      this.session.resetSession();
      return false;
    } else {
      return true;
    }
  }
}
