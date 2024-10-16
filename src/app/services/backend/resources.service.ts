import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  url = environment.URL;

  constructor(private http: HttpClient, private loadingService: LoadingService) {
    let module = 'resources';
    this.url = this.url+module
  }

  async get_argsdef(body){
    const url = `${this.url}/get_argsdef`;
    const request = this.http.get(url, { params: body });
    const response: any = await this.loadingService.get(request);
    return response;
  }
}
