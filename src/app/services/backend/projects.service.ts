import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  module="templates"
  url = environment.URL+module;

  constructor(private http: HttpClient, private loadingService: LoadingService) {
  }

  async getTemplates() {
    
  }
}
