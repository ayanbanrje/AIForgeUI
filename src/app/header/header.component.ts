import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private session: SessionService,private router:Router){

  }
  logout(){
    this.session.logout()
    this.router.navigate(['/login'])
  }
}
