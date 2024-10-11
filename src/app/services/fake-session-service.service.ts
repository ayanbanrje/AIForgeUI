import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { delay, Observable, of, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakeSessionServiceService {

  constructor(private sessionService: SessionService) {}

  login(username: string, password: string): Observable<any> {
    // Mock response
    if (username === 'admin') {
      const mockResponse = {
        token: 'mock-token-123456789',
        expiry: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),  // 1-hour expiry
        userDetails: {
          username: 'boschAdmin',
          role: 'admin',
          phone:'123456789',
          email:'email'
        }
      };

      // Simulate a successful login response
      return of(mockResponse).pipe(
        delay(1000),  // Simulate 1-second network delay
        tap(response => {
          this.sessionService.setSession(response.token, response.expiry);
        })
      );
    } else {
      // Simulate an error response for non-admin users
      return throwError(() => new Error('Invalid username or password')).pipe(
        delay(1000)  // Simulate a delay before the error
      );
    }
  }

  logout() {
    this.sessionService.logout();
  }
}
