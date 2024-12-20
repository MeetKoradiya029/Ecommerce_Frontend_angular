import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { USER_TYPES_DICT } from '../../../utils/constants';
import { DatePipe } from '@angular/common';
import { getDropDownData } from '../../../utils/utils';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, DatePipe, NgSelectModule],
  providers: [DatePipe, UserService ,{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css'
})
export class PersonalInformationComponent implements OnInit {

  passwordInputType: string = 'password';
  currentForm: any = 1;
  user_types: any = USER_TYPES_DICT
  userTypesArray: Array<any> = []
  userId: any
  userDetailsObj: any = {}
  isEditingPersonalInfo: boolean = false
  isEditingPhoneNumber: boolean = false;
  isEditingEmail: boolean = false;
  updateUserForm!: UntypedFormGroup;
  isLoggedIn:boolean = false;
  user:any;


  constructor(
    private fBuilder: UntypedFormBuilder,
    private userService: UserService,
    private toastrService: ToastrService
  ) {

    this.userId = JSON.parse(localStorage.getItem('usd'))
    this.user = localStorage.getItem('user_auth');
    if (this.user) {
      this.isLoggedIn = true
    }
    console.log("user id > type of", this.userId, typeof this.userId);
    this.userTypesArray = getDropDownData(this.user_types);

    this.updateUserForm = this.fBuilder.group({
      first_name: [null],
      last_name: [null],
      dial_code: [null],
      phone_number: [null],
      email: [null],
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.getUserDetails()
    }
  }

  getUserDetails(updateType?:string) {
    const params: any = {
      user_id: this.userId
    }

    this.userService.getUserById(params).subscribe({
      next: (res: any) => {
        if (res?.flag === 1) {
          this.userDetailsObj = res?.data
          if (!updateType) {
            this.updateUserForm.patchValue(this.userDetailsObj);
          } else {
            if (updateType === 'PersonalInfo') {
              this.updateUserForm.patchValue({
                first_name:this.userDetailsObj?.first_name,
                last_name: this.userDetailsObj?.last_name
              });
            }

            if (updateType === 'MobileNumber') {
              this.updateUserForm.patchValue({
                phone_number:this.userDetailsObj?.phone_number,
              });
            }

            if (updateType === 'Email') {
              this.updateUserForm.patchValue({
                email:this.userDetailsObj?.email,
              });
            }
          }
        }
      },
      error: (err: any) => { }
    })
  }

  editPersonalInfo() {
    this.isEditingPersonalInfo = !this.isEditingPersonalInfo
  }

  togglePhoneNumberInfoEditing() {
    this.isEditingPhoneNumber = !this.isEditingPhoneNumber
  }

  toggleEmailEditing() {
    this.isEditingEmail = !this.isEditingEmail
  }


  submitForm(type: string) {

    const formValues: any = this.updateUserForm?.value

    console.log("form obj >>>>", formValues);

    console.log("type >>>", type);

    if (type === 'PersonalInfo') {
      const payload:any = {
        id: this.userDetailsObj?.id
      }

      if (this.updateUserForm.controls['first_name']?.dirty && this.updateUserForm.controls['first_name']?.touched){
  
        const first_name = this.updateUserForm.controls['first_name']?.value;

        payload['first_name'] = first_name
        console.log("payload >>>>", payload);
      }

      if ((this.updateUserForm.controls['last_name']?.dirty && this.updateUserForm.controls['last_name']?.touched)) {
  
        const last_name = this.updateUserForm.controls['last_name']?.value
        payload['last_name'] = last_name
        console.log("payload >>>>", payload);
      }

      this.userService.updateUser(payload).subscribe({
        next: (res:any) => {
          this.getUserDetails('PersonalInfo');
          this.isEditingPersonalInfo = false
        },
        error: (error: any) => {}
      })

    }

    if (type === 'MobileNumber'){
      const payload: any = {
        id:this.userDetailsObj?.id
      }


      if (this.updateUserForm.controls['phone_number']?.dirty && this.updateUserForm.controls['phone_number']?.touched) {
        const phone_number = this.updateUserForm.controls['phone_number']?.value;
        payload['phone_number'] = phone_number;

        console.log("payload >>>>", payload);

        this.userService.updateUser(payload).subscribe({
          next: (res:any) => {
            this.getUserDetails('MobileNumber');
            this.isEditingPhoneNumber = false;
          },
          error: (error: any) => {}
        })
      }

    }

    if (type === 'Email') {
      const payload: any = {
        id:this.userDetailsObj?.id
      }

      if (this.updateUserForm.controls['email']?.dirty && this.updateUserForm.controls['email']?.touched) {
        const email = this.updateUserForm.controls['email']?.value;
        payload['email'] = email;

        console.log("payload >>>>", payload);
        this.userService.updateUser(payload).subscribe({
          next: (res:any) => {
            this.getUserDetails('Email');
            this.isEditingEmail = false;
          },
          error: (error: any) => {}
        })
      }
    }
  }


}
