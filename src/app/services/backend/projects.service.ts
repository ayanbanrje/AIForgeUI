import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  module="templates"
  url='';

  constructor(private http: HttpClient, private loadingService: LoadingService) {
    this.url = environment.URL+this.module;
  }

  // async getTemplates() {
    
  // }
  async ListTemplates(){
    const url = this.url + '/list';
    const request = this.http.get(url);
    const response: any = await this.loadingService.get(request);
    return response;
  }
}
