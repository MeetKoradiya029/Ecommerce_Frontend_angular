import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileSidebarComponent } from "./profile-sidebar/profile-sidebar.component";
import { TabViewModule } from 'primeng/tabview';
import { PersonalInformationComponent } from "./personal-information/personal-information.component";
import { AddressesComponent } from "./addresses/addresses.component";

@Component({
    selector: 'app-customer-profile',
    standalone: true,
    templateUrl: './customer-profile-layout.component.html',
    styleUrl: './customer-profile-layout.component.css',
    imports: [RouterModule, ProfileSidebarComponent, TabViewModule, PersonalInformationComponent, AddressesComponent]
})
export class CustomerProfileComponent {

    isLoggedIn:boolean = false;
    user:any;

    constructor(private router: Router) {
        this.user = localStorage.getItem('user_auth');

    if (this.user) {
      this.isLoggedIn = true
    }
    }


    logout() {

        console.log("logout fn>>>>>>>>>>>");
        
           localStorage.removeItem('user_auth')
           localStorage.removeItem('usd');
    
           this.router.navigate(['/login'])
      }

}
