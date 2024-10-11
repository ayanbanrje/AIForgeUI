/************************************************************************************************//**
 *
 * \file           :
 *
 * \brief          :
 *
 * \details        :
 *
 * \author         :
 *
 * \version        :
 *
 * \date           :
 *
 * \bug            :
 *
 * \warning        :
 *
 * \copyright      :
 *
***************************************************************************************************/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/************************************************************************************************//**
 *
 * \brief          :
 *
 * \details        :
 *
 * \remarks        :
 *
***************************************************************************************************/
export class TestsService {
  url: string;                                     //!< 
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_153
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  constructor(private http: HttpClient, public loadingService: LoadingService) {
    this.url = environment.tests;
  }


  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_154
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async groups(user, all?) {
    const request = this.http.get(this.url + 'itamGroups/group/' + user);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_155
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async tests() {
    const response: any = [];
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_156
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testsByID(id: string, all?) {
    const url = this.url + 'itamGroups/' + id;
    const response = await this.loadingService.httpGet(url);
    return all ? response : response[0];
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_157
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testviewdetailssize() {
    const url = this.url + 'itamGroups/master/size';
    const response = await this.loadingService.httpGet(url);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_158
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testviewdetailsunit() {
    const url = this.url + 'itamGroups/master/unit';
    const response = await this.loadingService.httpGet(url);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_159
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testviewdetailshaul() {
    const url = this.url + 'itamGroups/master/haul';
    const response = await this.loadingService.httpGet(url);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_160
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testviewdetailsload() {
    const url = this.url + 'itamGroups/master/load';
    const response = await this.loadingService.httpGet(url);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_161
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testviewdetailstype() {
    const url = this.url + 'itamGroups/master/type';
    const response = await this.loadingService.httpGet(url);
    return response;
  }


  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_162
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testCenters() {
    const url = this.url + 'itamGroups/centers';
    const response = await this.loadingService.httpGet(url);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_163
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testCentersById(id: string) {
    const url = this.url + 'itamGroups/centers/' + id;
    const response = await this.loadingService.httpGet(url);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_164
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async getInspection(vehicleId: string, tyreId?: string, current?: any, initial?: any) {
    let params = new HttpParams();
    params = params.append('vehicleId', vehicleId);
    if (tyreId) {
      params = params.append('tyreId', tyreId);
    }
    if (current) {
      params = params.append('current', current);
    }
    if (initial) {
      params = params.append('initial', initial);
    }
    const request = this.http.get(this.url + 'itamGroups/inspection', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_165
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async getFitmentStatus(testcodeId: string, fleetId?: string, vehicleId?: string, tyreId?: string) {
    let params = new HttpParams();
    if (testcodeId) {
      params = params.append('testcodeId', testcodeId);
    }
    if (fleetId) {
      params = params.append('fleetId', fleetId);
    }
    if (vehicleId) {
      params = params.append('vehicleId', vehicleId);
    }
    if (tyreId) {
      params = params.append('tyreId', tyreId);
    }
    const request = this.http.get(this.url + 'itamGroups/fitment/status', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_166
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async setInspection(data: any) {
    const request = this.http.post(this.url + 'itamGroups/inspection', data);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_167
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async pendingInspection(reason: any) {
    const request = this.http.post(this.url + 'itamGroups/inspectionPending', reason);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_168
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async uploadFile(file: File, folder: string, tyreId: string) {
    const formData: FormData = new FormData();
    formData.append('image', file);
    const request = this.http.post(this.url + 'itamGroups/image-upload/' + folder + '/' + tyreId, formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_169
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async removeTyre(data: any) {
    const request = this.http.post(this.url + 'itamGroups/removeTyre', data);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_170
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async addTyre(data: any) {
    const request = this.http.post(this.url + 'itamGroups/addTyre', data);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_171
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async alerts(param) {
    const url = this.url + 'itamGroups/alert/' + param;
    const response = await this.loadingService.httpGet(url);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_172
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async alertCatergory() {
    const url = this.url + 'itamGroups/alert/category';
    const response = await this.loadingService.httpGet(url);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_173
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async alertparameters() {
    const url = this.url + 'itamGroups/alert/parameters';
    const response = await this.loadingService.httpGet(url);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_174
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async deleteAlert(alertType, alertId) {
    const request = this.http.delete(`${this.url}itamGroups/alert/${alertType}/${alertId}`);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_175
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async saveAlert(data) {
    const request = this.http.post(`${this.url}itamGroups/alert/${data.alert.ALERT_PARAMETER}`, data);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_176
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async saveFleetMap(data) {
    const request = this.http.post(`${this.url}/itamGroups/multipleFleets`, data);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_177
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async alertCommunications(data) {
    const request = this.http.post(`${this.url}itamGroups/alert/communications`, data);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_178
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async vehiclecategories() {
    const request = this.http.get(this.url + 'itamGroups/categories');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_179
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async user(id: any) {
    const request = this.http.get(this.url + 'itamGroups/user/' + id);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  // async user(id: any) {
  //   const request = this.http.get(this.url + 'testcode/user/' + id);
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_180
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async yardList() {
    const request = this.http.get(this.url + 'itamGroups/yardList');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_181
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  // async yardLoaction(id: any) {
  //   const request = this.http.get(this.url + 'itamGroups/yard/' + id);
  //   const response: any = await this.loadingService.get(request);
  //   return response;
  // }
  async yardLoaction(id: any, fleetIds?: any) {
    let params = new HttpParams();
    if (fleetIds) {
      params = params.append('fleetIds', fleetIds);
    }
    const request = this.http.get(this.url + 'itamGroups/yard/' + id,{params});
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async yardLoactionByFleets(id: any, fleetIds?: any, yardIds?: any) {
    let params = new HttpParams();
    if (fleetIds) {
      params = params.append('fleetIds', fleetIds);
    }
    if (yardIds) {
      params = params.append('yardIds', yardIds);
    }
    const request = this.http.get(this.url + 'itamGroups/yardByFleets/' + id,{params});
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async vehicleMonitoring(userId, groupId?: string, ) {
    let params = new HttpParams();
    if (groupId) {
      params = params.append('groupId', groupId);
    }
    const request = this.http.get(this.url + 'itamGroups/vehicleMonitoring/' + userId,{params});
    const response: any = await this.loadingService.get(request);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_182
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async monitoredInfo(vehicleId: string, tyreId: string) {
    let params = new HttpParams();
    if (vehicleId && tyreId) {
      params = params.set('vehicleId', vehicleId)
        .append('tyreId', tyreId);
    }
    const request = this.http.get(this.url + 'itamGroups/monitoringDue', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_183
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async events(vehicles, from?, to?) {
    if (vehicles) {
      const vIds = vehicles.toString();
      let httpParams = new HttpParams();
      httpParams = httpParams.set('vIds', vIds);
      if (from && to) {
        httpParams = httpParams
          .append('from', from)
          .append('to', to);
      }
      const request = this.http.get(this.url + 'itamGroups/events', { params: httpParams });
      const response: any = await this.loadingService.get(request);
      return response;
    }
  }
  // async events(tyres, from?, to?) {
  //   if (tyres) {
  //     const tIds = tyres.toString();
  //     let httpParams = new HttpParams();
  //     httpParams = httpParams.set('tIds', tIds);
  //     if (from && to) {
  //       httpParams = httpParams
  //         .append('from', from)
  //         .append('to', to);
  //     }
  //     const request = this.http.get(this.url + 'itamGroups/events', { params: httpParams });
  //     const response: any = await this.loadingService.get(request);
  //     return response;
  //   } else {
  //     let params = new HttpParams();
  //     params = params.set('category', 'HH').append('count', 'true');
  //     if (from && to) {
  //       params = params.append('from', from).append('to', to);
  //     }
  //     const request = this.http.get(this.url + 'itamGroups/events', { params });
  //     const response: any = await this.loadingService.get(request);
  //     return response;
  //   }
  // }

  // async customerEvents(cId, count?, from?, to?) {
  //   if (cId) {
  //     let params = new HttpParams();
  //     params = params.set('cId', cId);
  //     if (from && to) {
  //       params = params
  //         .append('from', from)
  //         .append('to', to);
  //     }
  //     if (count) {
  //       params = params.append('count', 'true');
  //     }
  //     const request = this.http.get(this.url + 'itamGroups/events', { params });
  //     const response: any = await this.loadingService.get(request);
  //     return response;
  //   }
  // }

  // async customerEvents(cId, count?, from?, to?) {
  //   if (cId) {
  //     let params = new HttpParams();
  //     params = params.set('cId', cId);
  //     if (from && to) {
  //       params = params
  //         .append('from', from)
  //         .append('to', to);
  //     }
  //     if (count) {
  //       params = params.append('count', 'true');
  //     }
  //     const request = this.http.get(this.url + 'itamGroups/events', { params });
  //     const response: any = await this.loadingService.get(request);
  //     return response;
  //   }
  // }


  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_184
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async master(file: File) {
    const formData: FormData = new FormData();
    formData.append('master', file);
    const request = this.http.post(this.url + 'itamGroups/master', formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_185
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async masterDownload() {
    const request = this.http.get(this.url + 'itamGroups/master', { responseType: 'blob' });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_186
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async vehicleActiveOn(vehicleId: string) {
    const request = this.http.get(this.url + 'itamGroups/fitment/activeOn/' + vehicleId);
    const response: any = await this.loadingService.get(request);
    return response.data;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_187
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async threshold(vehicleType: string, param: string) {
    const request = this.http.get(this.url + 'itamGroups/threshold/' + vehicleType + '/' + param);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_188
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async vehicleCount(from?, to?) {
    let params = new HttpParams();
    if (from && to) {
      params = params.set('from', from).append('to', to);
    }
    const request = this.http.get(this.url + 'itamGroups/vehicles', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_189
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async vehicleFitmentStatus(from?, to?) {
    let params = new HttpParams();
    if (from && to) {
      params = params.set('from', from).append('to', to);
    }
    const request = this.http.get(this.url + 'itamGroups/vehicles/fitment', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_190
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async tyresStatus(from?, to?) {
    let params = new HttpParams();
    if (from && to) {
      params = params.set('from', from).append('to', to);
    }
    const request = this.http.get(this.url + 'itamGroups/tyres/status', { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_191
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async mileage(vehicleId, tyres, to?) {
    let params = new HttpParams();
    if (to) {
      params = params.set('to', to)
    }
    const request = this.http.get(`${this.url}itamGroups/mileage/${vehicleId}/${tyres}`, { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_192
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async vehicleRotation(vehicleId) {
    const request = this.http.get(this.url + 'itamGroups/vehicle/rotation/' + vehicleId);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_193
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testTestAllocation() {
    const request = this.http.get(this.url + 'itamGroups/testLocation');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_194
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testHaul() {
    const request = this.http.get(this.url + 'itamGroups/haul');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_195
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testLoad() {
    const request = this.http.get(this.url + 'itamGroups/load');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_196
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testUser() {
    const request = this.http.get(this.url + 'itamGroups/user');
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_197
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testLocationMaster() {
    const request = this.http.get(this.url + 'itamGroups/testAllocation');
    const response: any = await this.loadingService.get(request);
    return response;
  }
  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_198
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async testCreateUser(data: any) {
    const request = this.http.post(this.url + 'itamGroups/createUser', data);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_199
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async locationMaster(file: File) {
    const formData: FormData = new FormData();
    formData.append('master', file);
    const request = this.http.post(this.url + 'itamGroups/location/master', formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_200
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async haulMaster(file: File) {
    const formData: FormData = new FormData();
    formData.append('master', file);
    const request = this.http.post(this.url + 'itamGroups/haulType/master', formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_201
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async tyreSizeMaster(file: File) {
    const formData: FormData = new FormData();
    formData.append('master', file);
    const request = this.http.post(this.url + 'itamGroups/tyreSize/master', formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \param[in]     :
   *
   * \return         :
   *
   * \tag            SERVICES_D_202
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async loadMaster(file: File) {
    const formData: FormData = new FormData();
    formData.append('master', file);
    const request = this.http.post(this.url + 'itamGroups/loadType/master', formData);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_203
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async locationmasterDownload() {
    const request = this.http.get(this.url + 'itamGroups/locationMasterCSV', { responseType: 'blob' });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_204
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async haulmasterDownload() {
    const request = this.http.get(this.url + 'itamGroups/haulMasterCSV', { responseType: 'blob' });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_205
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async tyremasterDownload() {
    const request = this.http.get(this.url + 'itamGroups/tyreSizeMasterCSV', { responseType: 'blob' });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  /************************************************************************************************//**
   *
   * \brief          :
   *
   * \details        :
   *
   * \return         :
   *
   * \tag            SERVICES_D_206
   * 
   * \remarks        :
   *
   * \exception      :
   *
  ***************************************************************************************************/
  async loadmasterDownload() {
    const request = this.http.get(this.url + 'itamGroups/loadMasterCSV', { responseType: 'blob' });
    const response: any = await this.loadingService.get(request);
    return response;
  }
  async fleetByCustomerGroup(id: string) {
    const response: any = await this.loadingService.httpGet(this.url + 'itamGroups/customergroup/' + id);
    return response;
  }
  
  async fleetByCustomerGroups(id: string, cusGrpIds?: string) {
    let params = new HttpParams();
    if (cusGrpIds) {
      params = params.append('cusGrpIds', cusGrpIds);
    }
    const request = this.http.get(this.url + 'itamGroups/fleetByCustomerGroups/'+ id, { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async allCustomerGroup(id) {
      const response: any = await this.loadingService.httpGet(this.url + 'itamGroups/allCustomerGroup/' + id);
      return response;
  }

  async customerGroupsByID(id){
    const request = this.http.get(this.url + 'itamGroups/customerGroupsByID/'+ id);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async fleetsByUserId(id){
    const request = this.http.get(this.url + 'itamGroups/fleetsByUserId/'+ id);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  
  async yardsByUserId(id){
    const request = this.http.get(this.url + 'itamGroups/yardsByUserId/'+ id);
    const response: any = await this.loadingService.get(request);
    return response;
  }
  
  async fleetById(id){
    const request = this.http.get(this.url + 'itamGroups/'+ id);
    const response: any = await this.loadingService.get(request);
    return response;
  }

  async fleetByFleets(id: string, fleetIds?: string, customerCodeIds?: string) {
    let params = new HttpParams();
    if (fleetIds) {
      params = params.append('fleetIds', fleetIds);
    }
    if (customerCodeIds) {
      params = params.append('customerCodeIds', customerCodeIds);
    }
    // if (id) {
    //   params = params.append('groupId', id);
    // }
    //const response: any = await this.loadingService.httpGet(this.url + 'itamGroups/fleetByFleets/' + id, { params });
    const request = this.http.get(this.url + 'itamGroups/fleetByFleets/'+ id, { params });
    const response: any = await this.loadingService.get(request);
    return response;
  }

}
