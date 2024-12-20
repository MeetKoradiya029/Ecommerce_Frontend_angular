import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { Countries, stateList } from '../../utils/constants';
import { NgSelectModule } from '@ng-select/ng-select';
import { SellerService } from '../../services/seller.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seller-registration',
  standalone: true,
  imports: [ReactiveFormsModule, TabViewModule, NgSelectModule],
  templateUrl: './seller-registration.component.html',
  styleUrl: './seller-registration.component.css'
})
export class SellerRegistrationComponent {

  sellerService = inject(SellerService);
  ngxTaostrService = inject(ToastrService)

  personalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  activeIndex: number = 0;
  statesArray: Array<any> = stateList
  countryArray: Array<any> = Countries
  isLoading:boolean = false;


  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      // Define personal information controls
      Seller_Name: ['', Validators.compose([Validators.required])],
      Phone_Number: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required])],
      Address: ['', Validators.compose([Validators.required])],
      City: ['', Validators.compose([Validators.required])],
      State: [null, Validators.compose([Validators.required])],
      Postal_Code: ['', Validators.compose([Validators.required])],
      Country: [null],
      Return_Policy: [null],
      Shipping_Policy: [null],
      Seller_Since: [null],
      // ... other personal info controls
    });

    this.businessInfoForm = this.fb.group({
      // Define business information controls
      Business_Name: ['', Validators.compose([Validators.required])],
      Business_Phone: ['', Validators.compose([Validators.required])],
      Business_Email: ['', Validators.compose([Validators.required])],
      Business_Address: ['', Validators.compose([Validators.required])],
      Description: ['', Validators.compose([Validators.required])]
      // ... other business info controls
    });
  }

  onSubmitPersonalInfo(form: any) {
    this.isLoading = true;
    const formValues = form?.value;
    if (this.personalInfoForm.valid) {
      // Save personal info and navigate to the business info tab
      this.sellerService.saveSellerDetails(formValues).subscribe({
        next: (res: any) => {
          if (res?.flag) {
            this.isLoading = false;
            this.activeIndex = 1;
            this.ngxTaostrService.success('Seller Registered Successfully !')
          } else {
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          this.isLoading = false;
        }
      });
    } else {
      this.personalInfoForm.markAllAsTouched();
    }
  }

  onSubmitBusinessInfo(form: any) {
    const formValues = form?.value;
    if (this.businessInfoForm.valid) {
      
    } else {
      this.businessInfoForm.markAllAsTouched();
    }
  }

  goToPreviousTab() {
    this.activeIndex = 0;
  }
}
