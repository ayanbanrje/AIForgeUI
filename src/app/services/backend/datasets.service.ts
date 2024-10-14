import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading.service';
@Injectable({
  providedIn: 'root'
})
export class DatasetsService {
  url: string;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.url = environment.URL
  }

  async createNewDataSets(body) {
    const url = this.url + 'api/dataset/uploaddataset';
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    console.log("hello->>>>>>", response.data)
    return response.data;
  }
}
