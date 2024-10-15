import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleExtensionService {
  url: string;

  constructor(
    private http: HttpClient,
    private loadingService:LoadingService
  ) { 
    let module = 'components'
    this.url=environment.URL+module;
  }

  async ListAvailableCustomComponents(params){
    const url = this.url + '/getcomponents';
    const request = this.http.get(url, { params: params });
    const response: any = await this.loadingService.get(request);
    return response;
  }
  async createCustomComponent(body){
    const url = this.url + '/create-asset';
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  async uploadasset(body){
    const url = this.url + '/uploadasset';
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  async deleteCustomComponent(body){
    const url = this.url + '/deletecomponent';
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  downloadZip(postData: any): Observable<Blob> {
    const url = this.url + '/create-asset';
    return this.http.post(url, postData, {
      responseType: 'blob', // Expect a binary response (blob)
    });
  }
}
