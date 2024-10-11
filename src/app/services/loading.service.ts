/**
 * @author [DVD1KOR] Maddipoti Vineeth
 * @email [vineeth.maddipoti@in.bosch.com]
 * @create date 2019-03-14 23:59:43
 * @modify date 2019-03-14 23:59:43
 * @desc [Service loader, enable/disable loading overlay for service requests.]
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { LocaljsonService } from './localjson.service';

import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  constructor(private http: HttpClient, private auth: AuthService, private json: LocaljsonService) { }
  // show loading overlay
  show() {
    this.enabled = true;
  }
  // hide loading overlay
  hide() {
    this.enabled = false;
    this.counter = 0;
  }
  // service opened
  open() {
    this.counter = this.counter + 1;
    this.show();
  }
  // service closed
  done() {
    this.counter = this.counter - 1;
    if (this.counter <= 0) {
      this.hide();
    }
  }
  // service handler
  async get(request: Observable<any>) {
    const self = this;
    let response;
    self.open();
    await request.pipe(
      timeout(self.timeout * 60 * 1000),
      catchError((et) => {
        self.requestCancel(et.status);
        return of(null);
      })
    ).toPromise().then((success) => {
      response = success;
      self.done();
    }, (error) => {
      self.done();
      if (error.name === 'HttpErrorResponse') {
        self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
          self.error = er.find(e => e.errorCode === error.status);
        });
      } else {
        self.error = error.error;
      }
    });
    return response;
  }
  // service handler
  async httpGet(url: string, params?) {
    const self = this;
    let response;
    const retrivedData = self.dataHolder.find(data => data.url === url);
    if (retrivedData) {
      response = retrivedData.response;
    } else {
      const request = self.http.get(url, params);
      self.open();
      await request.pipe(
        timeout(self.timeout * 60 * 1000),
        catchError((et) => {
          self.requestCancel(et.status);
          return of(null);
        })
      ).toPromise().then((success) => {
        response = success;
        self.done();
        const dataObject = {
          url,
          response: success
        };
        self.dataHolder.push(dataObject);
      }, (error) => {
        self.done();
        if (error.name === 'HttpErrorResponse') {
          self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
            self.error = er.find(e => e.errorCode === error.status);
          });
        } else {
          self.error = error.error;
        }
      });
    }
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
    self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
      self.error = er.find(e => e.errorCode === (status ? status : 504));
    });
  }
  ngOnDestroy(): void {
    for (const sub in this.subscribed) {
      if (this.subscribed[sub]) {
        this.subscribed[sub].unsubscribe();
      }
    }
  }
}
