import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // END_POINT: any = environment.API_ENDPOINT
  END_POINT: any = "http://192.168.1.117:8088/api"


  constructor(
    private http: HttpClient
  ) { }

  loginUser(data:{}): Observable<any> {
    return this.http.post(`${this.END_POINT}/users/login`, data)
  }

  registerUser(data:{}) :Observable<any>{
    return this.http.post(`${this.END_POINT}/users/register`, data)
  }
 
}
