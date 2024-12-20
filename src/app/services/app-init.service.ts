import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { USER_TYPES_DICT } from '../utils/constants';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  _ngxPermissionService = inject(NgxPermissionsService);

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.loadingSubject.asObservable();

  userType:any =  USER_TYPES_DICT
  constructor(
    private ngxPermissionService : NgxPermissionsService
  ) { }

  initializeApp (
    userService: UserService,
    ngxPermissionService : NgxPermissionsService,
    dataService: DataService,
    router: Router
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('user_auth');
      const user_Id = localStorage.getItem('usd');


      if (user_Id && token) {

        console.log(" <...........<<<<< user_Id && token >>>>>>");
        

        userService.getUserById({user_id: user_Id}).subscribe({
          next: (res:any) => {
            if (res?.flag === 1) {
              const userData = res?.data; 
              dataService.storeUserDetailsInObservable(res?.data)
              if (userData?.user_type === 1) {

                ngxPermissionService.loadPermissions(["SELLER"]);
                // router.navigate(['/admin'])
                console.log("permiassions loaded >>>>", ngxPermissionService.getPermissions());
              } 

              if (userData?.user_type === 2) {
                ngxPermissionService.loadPermissions(["CUSTOMER"])
                router.navigate([''])
                console.log("permiassions loaded >>>>", ngxPermissionService.getPermissions());  
              }

              resolve(true);
              setTimeout(() => {
                this.loadingSubject.next(false);
              }, 2000);

            } else {
              resolve(true)
              this.loadingSubject.next(false);
              ngxPermissionService.loadPermissions([])
            }
          },
          error: (error:any) => {
            resolve(true)
            this.loadingSubject.next(false);
            ngxPermissionService.loadPermissions([]);
          }
        })

      } else {

        console.log(" else part >>>>>>>>>>>>>>>>>>>>>>>");
        this.loadingSubject.next(false);
        resolve(true);
      }

    })
  }
}
