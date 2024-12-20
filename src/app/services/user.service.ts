import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endPoint = environment.API_ENDPOINT

  constructor(
    private http : HttpClient
  ) { }


  getAllUsers(params = {}) : Observable<any> {
    return this.http.get(`${this.endPoint}/users/getAllUsers`, {params});
  }

  getUserById(params = {}):Observable<any> {
    return this.http.get(`${this.endPoint}/users/getUserById`, { params }); 
  }

  updateUser(params = {}): Observable<any> {
    return this.http.put(`${this.endPoint}/users/updateUser`,params)
  }

  logoutUser():Observable<any> {
    return this.http.get(`${this.endPoint}/users/logout`);
  }

  //-------------------- User Address ----------------------------------

  saveUserAddress(body:any):Observable<any> {
    return this.http.post(`${this.endPoint}/users/saveAddress`, body);
  }

  getUserAddressByUserId(params = {}):Observable<any> {
    return this.http.get(`${this.endPoint}/users/addressByUserId`, { params })
  }

  updateUserAddress(body:{}) :Observable<any> {
    return this.http.put(`${this.endPoint}/users/updateAddress`, body);
  }

  getUserAddressByAddressId(params = {}) :Observable<any> {
    return this.http.get(`${this.endPoint}/users/address`, { params })
  }
}
