import { Component } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AIForge';

  constructor(
    public message: MessageService,
    public router: Router,
    private auth: AuthService,
  ){
    
  }

  ngOnInit() { 
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['/login']);  // Redirect to login if not authenticated
    }
  }
}