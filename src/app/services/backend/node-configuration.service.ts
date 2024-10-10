/**
 * @ Author: Abhiranjan Mukherjee
 * @ Create Time: 2024
 * @ Modified by: Abhiranjan Mukherjee
 * @ Modified time: 2024
 * @ Description: Node Configuration Services
 */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeConfigurationService {
  url = `${environment.URL + environment.BACKENDSERVICE}`;
  constructor(private http: HttpClient) {
  }


  getNodeList(body: any): Observable<any> {
    const params = this.convertToHttpParams(body);
    let result: any;



    const url = `${this.url}/getallnodes`;

    return this.http.get(url, { params });
  }

  // Function to convert object to HttpParams
  private convertToHttpParams(obj: any): HttpParams {
    let params = new HttpParams();
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      params = params.set(key, value.toString());
    });
    return params;
  }
}
