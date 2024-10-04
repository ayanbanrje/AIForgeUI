import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  currentRoute: string;
  menuItems = [
    { label: 'Create Projects', route: '/projects' },
    { label: 'Module Extention', route: '/moduleextention' },
    { label: 'Node Configuration', route: '/nodeconfiguration' },
    { label: 'Data Sets', route: '/datasets' },
    { label: 'Market Place', route: '/marketplace' },
    //{ label: 'Contact', route: '/contact' }
  ];

  constructor( private router: Router) {}

  ngOnInit(): void {
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.currentRoute = event.url; // This gives you the path that is being navigated to
        //console.log('Navigation started to:', event.url);
      });
  
  }

  isActive(route: string): boolean {
    return this.currentRoute === route; // Compare current route with the menu item route
  }
}
