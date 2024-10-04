import { Component } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AIForge';
  showHeaderFooter = true; 

  constructor(
    private router: Router,
  ){
    
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Define the specific route where header and footer should be hidden
        this.showHeaderFooter = ['/createproject'].includes(event.url);
      }
    });
  }
}