import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  providers:[UserService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  userId:any;
  addressList: Array<any> = [];
  selectedAddress!: any;

  constructor(private userService: UserService) {
    this.userId = localStorage.getItem('usd');
  }


  ngOnInit(){
    if (this.userId) {
      this.getUserAddressList();
    }
}


getUserAddressList() {
const params:any = {
  user_id: this.userId
}

this.userService.getUserAddressByUserId(params).subscribe({
  next:(res:any) => {
    if (res?.flag) {
      this.addressList = res?.data;
      this.selectedAddress = this.addressList[0]
    } else {
      this.addressList = []
    }
  },
  error:(error:any) => {}
})
}

getSelectedAddress(event:any, addressObj:any) {
  
  console.log("radio event >>>", event.target.checked);

  if (this.selectedAddress.id == addressObj?.id) {
    console.log("selected address in default", this.selectedAddress);
    
  } else {
    console.log("selected address after change", addressObj);
  }
  
}
}
