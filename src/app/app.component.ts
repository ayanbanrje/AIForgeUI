import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AIForge';

  constructor(
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