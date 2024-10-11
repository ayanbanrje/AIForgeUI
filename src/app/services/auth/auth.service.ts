import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';

// const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // constructor(public jwtHelper: JwtHelperService) { }
  constructor() { }


  public isAuthenticated(): boolean {
    // const token = localStorage.getItem('token_expiry');
    // return !this.jwtHelper.isTokenExpired(token);
    const tokenExpiry = localStorage.getItem('token_expiry');

    if (!tokenExpiry) {
      return false;  // No expiry means not authenticated
    }
  
    const now = new Date();
    const expiryDate = new Date(tokenExpiry);
  
    // Check if the current time is before the expiry time
    return now < expiryDate;
  }

  // public isExpired(): boolean {
  //   const token = localStorage.getItem('token_expiry');
  //   if (token) {
  //     const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
  //     return true
  //     return (expirationDate.getTime() < new Date().getTime());
  //   } else {
  //     return true;
  //   }
  // }

  // public decodeToken() {
  //   const token = localStorage.getItem('accessToken');
  //   return token ? this.jwtHelper.decodeToken(token) : null;

  // }
}
