import { Component, OnInit, DoCheck, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, DoCheck {
  navigations;
  activeRoute;
  @Output() naviagtedChange = new EventEmitter();
  constructor(private appService: AppService, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    this.active();
    /*this.navigations.find(n => n.label === 'Dashboard').name = this.translate.instant('Dashboard');
    this.navigations.find(n => n.label === 'Real Time Monitoring').name = this.translate.instant('Real_Time_Monitoring');
    this.navigations.find(n => n.label === 'Reports and Analysis').name = this.translate.instant('Reports_and_Analysis');
    this.navigations.find(n => n.label === 'Alerts and Notification').name = this.translate.instant('Alerts_and_Notification');
    this.navigations.find(n => n.label === 'Settings').name = this.translate.instant('Settings');
    this.navigations.find(n => n.label === 'User Profile').name = this.translate.instant('User_Profile');
    this.navigations.find(n => n.label === 'Logout').name = this.translate.instant('Logout');*/
  }

  ngDoCheck() {
    this.active();
  }

  active() {
    this.navigations = this.appService.navigation;
    this.activeRoute = this.router.url.replace('/', '');
    this.appService.activeRoute = this.activeRoute;
    this.navigations.find(n => n.label === 'Dashboard').name = this.translate.instant('Dashboard');
    this.navigations.find(n => n.label === 'Real Time Monitoring').name = this.translate.instant('Real_Time_Monitoring');
    this.navigations.find(n => n.label === 'Reports and Analysis').name = this.translate.instant('Reports_and_Analysis');
    this.navigations.find(n => n.label === 'Alerts and Notification').name = this.translate.instant('Alerts_and_Notification');
    this.navigations.find(n => n.label === 'Settings').name = this.translate.instant('Settings');
    this.navigations.find(n => n.label === 'User Profile').name = this.translate.instant('User_Profile');
    this.navigations.find(n => n.label === 'Logout').name = this.translate.instant('Logout');
  }

  navigate(nav) {
    if (nav.route) {
      this.navigations.forEach(n => {
        n.active = false;
        if (n.label === nav.name) {
          nav.active = true;
        }
      });
      this.appService.navigation = this.navigations;
      this.router.navigate([nav.route]);
      this.naviagtedChange.emit(false);
    }
  }

}
