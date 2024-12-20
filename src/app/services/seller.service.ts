import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  http = inject(HttpClient)
  endPoint = environment.API_ENDPOINT

  saveSellerDetails(body: any): Observable<any> {
    return this.http.post(`${this.endPoint}/seller/register`, body);
  }

  updateSellerDetails(body: any): Observable<any> {
    return this.http.put(`${this.endPoint}/seller/update`, body);
  }

  getAllSellerDetails(params = {}): Observable<any> {
    return this.http.get(`${this.endPoint}/seller/getAllSellers`, { params });
  }

  getAllSellerDetailsById(params = {}): Observable<any> {
    return this.http.get(`${this.endPoint}/seller`, { params });
  }

}
