import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ADDRESS_TYPE, stateList } from '../../../utils/constants';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgSelectModule, RouterModule],
  providers:[UserService],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {

  addressForm!: FormGroup;
  statesArray:Array<any> = stateList
  addressTypeArray: Array<any> = ADDRESS_TYPE
  showAddress:boolean = false;
  userId:any;
  addressList: Array<any> = [];
  addressObj:any = {};
  editAddressId: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router

  ) {

    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      pincode: ['', Validators.required],
      locality: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [null, Validators.required],
      landmark: [''],
      alternate_phone: [''],
      locationTypeTag: ['Home', Validators.required]
    });
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
        } else {
          this.addressList = []
        }
      },
      error:(error:any) => {}
    })
  }


  submitAddress(form:any) {
    if (this.addressForm.valid) {
      console.log('Address form submitted:', this.addressForm.value);
      const formValues = form.value;
      formValues['user_id'] = this.userId
      if (this.editAddressId) {
        formValues['id'] = this.editAddressId;
        this.userService.updateUserAddress(formValues).subscribe({
          next:(res:any) => {
            if (res?.flag) {
              this.addressForm.reset();
              this.showAddress = false;
              this.getUserAddressList();
            }
          },
          error:(res:any) => {}
        })
      } else {  
        this.userService.saveUserAddress(formValues).subscribe({
          next:(res:any) => {
            if (res?.flag) {

            }
          }
        });
      }
       
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  getAndPatchFormData(addressId:string) {
    this.editAddressId = addressId
    const params:any = {
      id:this.editAddressId
    }
    this.showAddress = true;
    this.userService.getUserAddressByAddressId(params).subscribe({
      next:(res:any) => {
        if (res?.flag) {
          this.addressObj = res?.data;
          this.addressForm.patchValue(this.addressObj);
        }
      },
      error: (error:any) => {}
    })
  }

  cancelAddressForm() {
    this.showAddress = false;
    this.addressForm.reset();
  }

  showAddressForm() {
    this.showAddress = true;
  }

}
