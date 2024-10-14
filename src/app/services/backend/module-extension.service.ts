import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading.service';

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
    return response.data;
  }
  async createCustomComponent(body){
    const url = this.url + '/create-asset';
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    console.log("hello->>>>>>",response.data)
    return response.data;
  }
}
