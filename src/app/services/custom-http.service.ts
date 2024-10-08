import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomHttpService {
    constructor(private http: HttpClient) { }

    getWithBody(url: string, body: any, headers?: HttpHeaders): Observable<any> {
        // Create a GET request with a body
        const req = new HttpRequest('GET', url, body, { headers });
        return this.http.request(req);
    }
}
