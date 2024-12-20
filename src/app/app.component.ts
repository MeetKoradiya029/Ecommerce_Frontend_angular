import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { AppInitService } from './services/app-init.service';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxPermissionsModule],
  providers:[AuthService, NgxPermissionsService, DataService, UserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isLoading:boolean = true;
  token = localStorage.getItem('user_auth');
  user_Id = localStorage.getItem('usd');
  userDetailsObj:any = {};

  constructor(
    private appInitService: AppInitService
  ) {
    this.appInitService.isLoading$.subscribe((loading:any) => {
      this.isLoading = loading;
    })
  }

ngOnInit() {
  //  this.checkAndloadPermisisons();
}

  // checkAndloadPermisisons() {
  //   if (this.user_Id && this.token) {

  //     console.log(" <...........<<<<< user_Id && token >>>>>>");
      
  //     if (!this.userDetailsObj) {
  //       this.userService.getUserById({user_id: this.user_Id}).subscribe({
  //         next: (res:any) => {
  //           if (res?.flag === 1) {
  //             const userData = res?.data; 
  //             // this.dataService.storeUserDetailsInObservable(res?.data)
  //             if (userData?.user_type === 1) {
  
  //               this.ngxPermissionService.loadPermissions(["SELLER"])
  //             } 
  
  //             if (userData?.user_type === 2) {
  //               this.ngxPermissionService.loadPermissions(["CUSTOMER"])
  //             }
  
  //           } else {
              
  //            this.ngxPermissionService.loadPermissions([])
  //           }
  //         },
  //         error: (error:any) => {
            
  //           this.ngxPermissionService.loadPermissions([]);
  //         }
  //       })
  //     }

  //   } else {

  //     console.log(" else part >>>>>>>>>>>>>>>>>>>>>>>");
  //   }
  // }

      

}
