import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnDestroy {
  enabled: boolean = false;
  counter: number = 0;
  error: any = {};
  timeout: number = 2; // in minutes
  dataHolder: Array<any> = [];
  subscribed: any = {};

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Show loading overlay
  show() {
    this.enabled = true;
  }

  // Hide loading overlay
  hide() {
    this.enabled = false;
    this.counter = 0;
  }

  // Service opened
  open() {
    this.counter += 1;
    this.show();
  }

  // Service closed
  done() {
    this.counter -= 1;
    if (this.counter <= 0) {
      this.hide();
    }
  }

  // Generic service handler for API requests
  async get(request: Observable<any>, cacheKey?: string) {
    const self = this;
    let response;
    const cachedData = cacheKey ? self.dataHolder.find(data => data.url === cacheKey) : null;

    // Return cached response if available
    if (cachedData) {
      return cachedData.response;
    }

    self.open();
    await request.pipe(
      timeout(self.timeout * 60 * 1000),
      catchError((error: HttpErrorResponse) => {
        // Log the error and return the error object
        console.error("Error occurred", error);
        self.done();
        return throwError(() => error);  // rethrow error so it can be caught in the promise
      })
    ).toPromise().then((success) => {
      console.log("success", success);
      response = success;
      self.done();

      // Cache the response if a cacheKey is provided
      if (cacheKey) {
        const dataObject = { url: cacheKey, response: success };
        self.dataHolder.push(dataObject);
      }
    }, (error) => {
      console.log("error", error); // Log the error in the 'then' block
      self.done();
      if (error instanceof HttpErrorResponse) {
        // Handle error by status code, you can customize this
        self.error = `Error Status: ${error.status}, Message: ${error.message}`;
      } else {
        self.error = error.error;
      }
    });

    return response;
  }

  allowService() {
    return this.auth.isAuthenticated();
  }

  public resetDataHolder() {
    this.dataHolder = [];
  }

  requestCancel(status?) {
    const self = this;
    self.done();
    // Customize error code handling here
  }

  ngOnDestroy(): void {
    for (const sub in this.subscribed) {
      if (this.subscribed[sub]) {
        this.subscribed[sub].unsubscribe();
      }
    }
  }
}
