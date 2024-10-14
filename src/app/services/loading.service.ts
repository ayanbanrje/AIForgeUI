import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { timeout, catchError } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnDestroy {
  enabled: boolean = false;
  counter: number = 0;
  error: any = {};  // Store the error message
  timeout: number = 2; // in minutes
  dataHolder: Array<any> = [];
  subscribed: any = {};

  constructor(private http: HttpClient, private auth: AuthService, private message: MessageService) { }

  // Show loading overlay
  show() {
    this.enabled = true;
  }

  // Hide loading overlay
  hide() {
    this.enabled = false;
    this.counter = 0;
  }

  // Service opened (loading spinner should be shown)
  open() {
    this.counter += 1;
    this.show();
  }

  // Service closed (loading spinner should be hidden)
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

    // Check for cached response if cacheKey is provided
    const cachedData = cacheKey ? self.dataHolder.find(data => data.url === cacheKey) : null;
    if (cachedData) {
      return cachedData.response;
    }

    // Show loading
    self.open();

    await request.pipe(
      timeout(self.timeout * 60 * 1000),
      catchError((error: HttpErrorResponse) => {
        self.done();  // Hide the loading spinner when error occurs
        // console.error("Error occurred:", error);  // Log the error

        //you can show error here also
        // Re-throw the error so that it can be handled further
        return throwError(() => error);
      })
    ).toPromise().then((success) => {
      // console.log("API Success:", success);  // Log success
      if (success.status == 'failure') {
        // console.log("inside fail")
        self.error.status = success.status ? success.status : 'failure';
        self.error.message = success.error_message ? success.error_message : 'Sorry , there is something wrong !';
        this.showError(self.error)
        response = success;
        self.done();
      } else {
        // console.log("inside success",success)
        response = success;
        self.done(); 
      }

    // console.log("response 85",response)

      // Cache the response if cacheKey is provided
      if (cacheKey) {
        const dataObject = { url: cacheKey, response: success };
        self.dataHolder.push(dataObject);
      }
    }).catch((error) => {
      console.error("API Error:", error);  // Log the error
      self.done();  // Hide loading spinner after failure

      // Set error message for UI
      self.error.status = error.status ? error.status : 'failure';
      self.error.message = error.error.error_message ? error.error.error_message : 'Sorry , there is something wrong !';
      this.showError(self.error)
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
    // Error handling logic (if needed)
  }

  showError(error) {
    if (error) {
      this.message.createMessage({
        header: `Code: ${error.status}`,
        message: error.message,
        yes: {
          label: 'Ok',
          action: () => {
            this.message.close();
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    for (const sub in this.subscribed) {
      if (this.subscribed[sub]) {
        this.subscribed[sub].unsubscribe();
      }
    }
  }
}
