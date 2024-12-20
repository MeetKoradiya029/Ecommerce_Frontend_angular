import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  userDetailsObs$ = new BehaviorSubject(null);
  userDetailsObs = this.userDetailsObs$.asObservable();

  private isUserAuthenticated$ = new Subject()
  public isUserAuthenticated = this.isUserAuthenticated$.asObservable();

  constructor() { }


  storeUserDetailsInObservable (userObj:any) {
    this.userDetailsObs$.next(userObj);
  }

  saveFlagForAuthenticatedUsers(isAuthenticated:boolean) {
      this.isUserAuthenticated$.next(isAuthenticated)
  } 
}
