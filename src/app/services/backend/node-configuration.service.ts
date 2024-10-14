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
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class NodeConfigurationService {

  url = environment.URL;

  constructor(private http: HttpClient, private loadingService: LoadingService) {
    let module = 'nodes';
    this.url = this.url+module
  }


  async getNodeList(body) {
    const url = `${this.url}/getallnodes`;
    const request = this.http.get(url, { params: body });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async deleteNode(body) {
    const url = `${this.url}/deletenode`;
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async createnodes(body) {
    const url = `${this.url}/createnodes`;
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async getnodes(body) {
    const url = `${this.url}/getnodes`;
    const request = this.http.get(url, { params: body });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async updatenode(body) {
    const url = `${this.url}/updatenode`;
    const request = this.http.post(url, body);
    const response: any = await this.loadingService.get(request);
    return response;
  }

}
