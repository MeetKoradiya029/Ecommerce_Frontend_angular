import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { USER_TYPES_DICT } from '../../utils/constants';
import { getDropDownData } from '../../utils/utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    RouterModule, 
    NgIf, 
    NgClass, 
    BsDatepickerModule, 
    HttpClientModule, 
    DatePipe,
    NgSelectModule
  ],
  providers: [BsDatepickerConfig, AuthService, DatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: UntypedFormGroup
  passwordInputType: string = 'password';
  currentForm: any = 1;
  user_types:any = USER_TYPES_DICT
  userTypesArray:Array<any> = []


  bsValue = new Date();


  constructor(
    private fBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.userTypesArray = getDropDownData(this.user_types);


    this.registerForm = this.fBuilder.group({
      first_name: [null, Validators.compose([Validators.required])],
      last_name: [null, Validators.compose([Validators.required])],
      dial_code: [null],
      phone_number: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      user_type: [null, Validators.compose([Validators.required])],
      date_of_birth: [null, Validators.compose([Validators.required])],
    });


    // this.genericValidator = new GenericFormValidator()

  }

  submitForm(form: any) {

    const formValues: any = form?.value

    console.log("form obj >>>>", formValues);

    const dateOfbirth = formValues?.date_of_birth

    const formattedDate = this.datePipe.transform(dateOfbirth, "YYYY-MM-dd")


    console.log("date of birth >>>", formValues?.date_of_birth);

    const payload: any = {
      first_name: formValues.first_name,
      last_name: formValues?.last_name,
      email: formValues?.email,
      phone_number: formValues?.phone_number,
      password: formValues?.password,
      date_of_birth: formattedDate,
      gender: "Male",
      subscribe_newsletter: true,
      agreed_terms_and_conditions: true,
      user_type: formValues?.user_type
    }


    console.log("payload >>>>", payload);
    
    if (this.registerForm.valid) {
      this.authService.registerUser(payload).subscribe({
        next: (res: any) => {
          console.log("response >>>", res);
  
        },
        error: (error: any) => { }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }

   
    // this.dataService.isAuthentecatedSubject.next(true);
    // this.router.navigate([''])
  }


  handlePasswordShowClick() {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
    }
  }

  back() {
    this.currentForm = 1
  }



  // Set the default active tab to 'basic'

  // onSubmitBasicInfoForm() {
  //   // Handle form submission for basic information
  //   // After successful submission, switch to the address tab
  //   this.activeTab = 'address';
  // }
}
