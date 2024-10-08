import { Injectable } from '@angular/core';
//import { UserProfile } from '../../models/user-profile';
import { Router } from '@angular/router';
//import { Auth } from 'aws-amplify';
import { AppService } from '../app.service';
import { CustomersService } from '../backend/customers.service';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user: UserProfile;
  accessToken;
  refreshToken;
  url: string;
  authError;
  info;
  public accessKey;
  public secretKey;
  public sessionToken;
  public expiration;
  constructor(
    private router: Router,
    private app: AppService) {
  }

  async logout() {
    try {
      await Auth.signOut();
      this.resetSession();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['auth', 'login']);
    } catch (error) {
      //console.log('error signing out: ', error);
    }
  }

  async setSession(response) {
    if (response && response.profile) {
      Auth.currentCredentials().then((info: any) => {
        console.log("Set value in session!!", info)
        this.accessKey = info.accessKeyId;
        this.secretKey = info.secretAccessKey;
        this.sessionToken = info.sessionToken;
        this.expiration = info.expiration;
        localStorage.setItem('accessKey', info.accessKeyId);
        localStorage.setItem('secretKey', info.secretAccessKey);
        localStorage.setItem('sessionToken', info.sessionToken);
        localStorage.setItem('expiration', info.expiration);
        localStorage.setItem('profile', JSON.stringify(response.profile));
        console.log("Set value in session Completed!!")
      });
      this.user = new UserProfile(response.profile);
      this.app.user = this.user;
      //console.log(this.user);
      //console.log(this.app.user);

      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
      localStorage.setItem('profile', JSON.stringify(response.profile));
      localStorage.setItem('username', this.user.email);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } else {
      if (response && response.code) {
        this.resetSession();
        this.authError = response;
      }
    }
  }

  setRefresh(user) {
    if (user) {
      this.setSession(user);
    }
  }

  resetSession() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('credentials');
    localStorage.removeItem('accessKey');
    localStorage.removeItem('secretKey');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('expiration');

    sessionStorage.removeItem('THIS_CLUSTER');
    sessionStorage.removeItem('THIS_COUNTRY');
    sessionStorage.removeItem('THIS_CITY');
    sessionStorage.removeItem('THIS_STORE');
    sessionStorage.removeItem('THIS_BASIC_DETAILS');
  }

  setUserInfo(user) {
    this.app.user = new UserProfile(JSON.parse(user));
    if (localStorage.getItem('profile')) {
      this.setSession(JSON.parse(localStorage.getItem('profile')));
    }
  }

  public validSession() {
    const sessionDetails = localStorage.getItem('profile');
    if (sessionDetails) {
      const expirationTime = new Date(JSON.parse(sessionDetails).exp * 1000).getTime();
      const currentTime = new Date().getTime();
      const seconds = Math.floor((expirationTime - currentTime) / 1000);
      return seconds > 0;
    } else {
      return false;
    }
  }

  updateEulaLocal(isAccepted) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    profile["custom:eula"] = isAccepted ? 'TRUE' : 'FALSE';
    localStorage.setItem('profile', JSON.stringify(profile));
    this.user = new UserProfile(profile);
    this.app.user = this.user;
    if (!isAccepted) {
      this.logout();
      return;
    }
  }

}
