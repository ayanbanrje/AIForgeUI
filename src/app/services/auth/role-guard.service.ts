import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
} from '@angular/router';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(public sessionService: SessionService, public router: Router) { }


  canActivate(route: any): boolean {
    const userRole = this.getUserRoleFromToken();  // Assume this parses token for roles
    const requiredRole = route.data.expectedRole;
    if (userRole !== requiredRole[0]) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  private getUserRoleFromToken() {
    const token = this.sessionService.getToken();
    return 'SUPERUSER';  // Example
  }
  
}
