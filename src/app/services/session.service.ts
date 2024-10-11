import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user: User;
  accessToken;
  refreshToken;
  url: string;
  authError;
  info;
  isSuperCustomer = false;


  private TOKEN_KEY = 'auth_token';
  private EXPIRY_KEY = 'token_expiry';



  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    ) {
    this.url = environment.fleets;
  }

  // logout() {
  //   // this.resetSession();
  //   this.router.navigate(['/login']);
  // }

  async login(auth) {
    // this.resetSession();
    this.authError = null;
    const url = this.url + 'auth/login';
    const request = this.http.post(url, auth);
    const response: any = await this.loadingService.get(request);
    // this.setSession(response);
    return response;
  }

  // async getCode(auth) {
  //   this.authError = null;
  //   const url = this.url + 'auth/getCode';
  //   const request = this.http.post(url, auth);
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }

  // async forgotPassword(auth) {
  //   this.authError = null;
  //   const url = this.url + 'auth/forgot';
  //   const request = this.http.post(url, auth);
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }

  // async termsConditions(auth) {
  //   this.authError = null;
  //   const url = this.groupurl + 'itamGroups/termsConditions';
  //   const request = this.http.post(url, auth);
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }

  // async gettermsconditionsData() {
  //   const request = this.http.get(this.url + 'auth/termsConditionsData');
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }
  
  // async session() {
  //   if (localStorage && localStorage['username'] && localStorage['refreshToken']) {
  //     const username = localStorage['username'];
  //     const url = this.url + 'auth/session';
  //     let headers: HttpHeaders = new HttpHeaders();
  //     headers = headers.append('Authorization', localStorage['refreshToken']);
  //     const request = this.http.post(url, { username }, { headers });
  //     const response: any = await this.loadingService.get(request);
  //     this.setRefresh(response);
  //     return response;
  //   }
  // }

  // setSession(response) {
  //   if (response && response.username) {
  //     this.user = new User(response);
  //     console.log("this.user",this.user)
  //     this.accessToken = response.accessToken;
  //     this.refreshToken = response.refreshToken;
  //     localStorage.setItem('user', JSON.stringify(response));
  //     localStorage.setItem('username', response.username);
  //     localStorage.setItem('accessToken', response.accessToken);
  //     localStorage.setItem('idToken', response.idToken);
  //     localStorage.setItem('refreshToken', response.refreshToken);
  //   } else {
  //     if (response && response.code) {
  //       this.resetSession();
  //       this.authError = response;
  //     }
  //   }
  // }

  // setRefresh(user) {
  //   if (user) {
  //     this.setSession(user);
  //   }
  // }

  resetSession() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('credentials');
  }

  // setUserInfo(user) {
  //   this.info = user;
  //   if (localStorage.getItem('user')) {
  //     localStorage.setItem('userInfo', JSON.stringify(user));
  //     this.setSession(JSON.parse(localStorage.getItem('user')));
  //   }
  // }
  
  


  setSession(token?: string, expiry?: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRY_KEY, expiry);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
