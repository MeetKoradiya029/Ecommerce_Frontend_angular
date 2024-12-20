import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { USER_TYPES_DICT } from '../../utils/constants';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  providers:[AuthService, DataService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: UntypedFormGroup
  passwordInputType: string = 'password';
  user_types:any = USER_TYPES_DICT

  constructor(
    private fBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) {

    this.loginForm = this.fBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });


    // this.genericValidator = new GenericFormValidator()

  }

  submitForm(form: any) {
    const formData = form.value
    console.log("login form>>>>>", formData);

    if (this.loginForm.valid) {
      
    this.authService.loginUser(formData).subscribe({
      next: (response: any) => {
          console.log("login response >>>>", response);

          if (response?.flag === 1) {
            const userData = response?.data
            localStorage.setItem("user_auth", response?.token);
            localStorage.setItem("usd", response?.data?.id)
            this.dataService.storeUserDetailsInObservable(response?.data)
            if (userData?.user_type === 1) {
                console.log("user type> ");
                this.router.navigateByUrl('/admin')
            } else {
              this.router.navigate([""]);
            }
          }
          
      },error: (error: any) => {

      }
    })
    } else {
      this.loginForm.markAllAsTouched();
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
}
