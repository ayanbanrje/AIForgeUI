import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  [x: string]: any;
  private url = './assets/data/';

  constructor(public http: HttpClient) { }

  public addLocation(): Observable<any> {
    return this.http.get(this.url + 'add-location.json');
  }

  public location(): Observable<any> {
    return this.http.get(this.url + 'location.json');
  }

  public login(): Observable<any> {
    return this.http.get(this.url + 'login.json');
  }

  public register(): Observable<any> {
    return this.http.get(this.url + 'register.json');
  }

  public addOperatingTime(): Observable<any> {
    return this.http.get(this.url + 'add-operating-time.json');
  }

  public forgotPassword(): Observable<any> {
    return this.http.get(this.url + 'forgot-password.json');
  }

  public confirmSignIn(): Observable<any> {
    return this.http.get(this.url + 'confirm-signin.json');
  }

  public updatePassword(): Observable<any> {
    return this.http.get(this.url + 'update-password.json');
  }

  public changePassword(): Observable<any> {
    return this.http.get(this.url + 'change-password.json');
  }
  public customerSupport(): Observable<any> {
    return this.http.get(this.url + 'customer-support.json');
  }
  public about(): Observable<any> {
    return this.http.get(this.url + 'about.json');
  }

  public mapingOfAppliances(): Observable<any> {
    return this.http.get(this.url + 'map-appliance.json');
  }
  public addUsers(): Observable<any> {
    return this.http.get(this.url + 'add-user.json');
  }
  public createGroup(): Observable<any> {
    return this.http.get(this.url + 'create-group.json');
  }

  public timeZone(): Observable<any> {
    return this.http.get(this.url + 'time-zone.json');
  }

  public errorCodes(): Observable<any> {
    return this.http.get(this.url + 'error-codes.json');
  }

  public loginJson(): Observable<any> {
    return this.http.get(this.url + 'profile.json');
  }
  public getWorldData(): Observable<any> {
    // return this.http.get(this.url + 'world-50m.json');
    return this.http.get(this.url + 'world-110m2.json');
  }
  public getCitiesData(): Observable<any> {
    return this.http.get(this.url + 'cities.json');
  }
  public getAlertsAndNotificationData(): Observable<any> {
    return this.http.get(this.url + 'alerts-and-notification.json');
  }
  public getDefaultsData(): Observable<any> {
    return this.http.get(this.url + 'defaults.json');
  }
  public getAlertViewData(): Observable<any> {
    return this.http.get(this.url + 'alertview.json');
  }
  public getAlertActionData(): Observable<any> {
    return this.http.get(this.url + 'alertAction.json');
  }

  public getCompanyLocation(): Observable<any> {
    return this.http.get(this.url + 'company-location.json');
  }

  public addOverviewLocation(): Observable<any> {
    return this.http.get(this.url + 'store-location.json');
  }

  public getCountry(): Observable<any> {
    return this.http.get(this.url + 'country.json');
  }

  public cadlogin(): Observable<any> {
    return this.http.get(this.url + 'login-cad.json');
  }
}
