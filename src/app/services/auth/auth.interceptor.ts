import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // constructor(private http: HttpClient, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Interceptor is called', req.url); 
        let token = localStorage.getItem('idToken');
        if (req.url.includes('/auth/session')) {
            token = localStorage.getItem('idToken');
        }
        if (!token) {
            return next.handle(req);
        }
        let clone: HttpRequest<any> = req.clone();
        if (!req.url.includes('analytics.ceat.in')) {
            clone = req.clone({
                headers: req.headers.set('Authorization', token),
            });
        }
        return next.handle(clone);
    }

}
