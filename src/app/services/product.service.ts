import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  endPoint = environment.API_ENDPOINT
  // endPoint = "http://192.168.1.117:8088/api"

  constructor(
    private http: HttpClient
  ) { }

  // Product Routes

  getAllProducts(params = {}) :Observable<any> {
    return this.http.get(`${this.endPoint}/products`, {params});
  }

  addProduct(body:{}) :Observable<any> {
    console.log("add product Body >>>>>", body);
    
    return this.http.post(`${this.endPoint}/products/add`, body)
  }

  updateProduct(body: any) :Observable<any> {
    console.log("body>>>>> in service >",body);
    
    return this.http.post(`${this.endPoint}/products/edit`,body)
  }

  getProductById(params = {}): Observable<any> {
    console.log("params >>>", params);
    
    return this.http.get(`${this.endPoint}/products/productById`, {params})
  }

  deleteProductById(params:any) : Observable<any> {
    return this.http.delete(`${this.endPoint}/products/delete`, {params});
  }

  getTotalRecords ():Observable<any> {
    return this.http.get(`${this.endPoint}/products/totalRecords`);
  }

  // Category Routes


  getAllCategories(params = {}): Observable<any> {
    return this.http.get(`${this.endPoint}/category`, params)
  }
}
