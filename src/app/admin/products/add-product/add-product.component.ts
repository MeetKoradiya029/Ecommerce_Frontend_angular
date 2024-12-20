import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductService } from '../../../services/product.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, NgSelectModule, ToastrModule],
  providers:[ProductService,{ provide: ToastrService, useClass: ToastrService}],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit{

  productForm!: UntypedFormGroup

  selectedCar!:any
  categoryArray: Array<any> = []
  idEditing: boolean = false;
  productId:any;
  formData!: FormData;
  productObj: any;

  constructor (
    private fBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private tostrService : ToastrService,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) {

    this.productForm = this.fBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])],
      stock_quantity: [null, Validators.compose([Validators.required])],
      category_id: [null, Validators.compose([Validators.required])],
      is_active: [true]
    });

    this.formData = new FormData();

    console.log("activated Route >>>>>", this.activatedRoute);
    
    this.activatedRoute.params.subscribe((data:any) => {
      console.log("data>>>>", data);
      this.productId = data?.id;
      
    });

  }
  ngOnInit() {
    this.getAllCategories();
    if (this.productId) {
      this.getAndPatchProductDetails()
    }
  }

  getAndPatchProductDetails () {
    const params :any = {
      id : this.productId
    }
    this.productService.getProductById(params).subscribe({
      next: (res:any) => {
        if (res?.flag === 1) {
          this.productObj = res?.data
          this.productForm.patchValue(res?.data)
        }
      },
      error: (error :any) => {}
    })
  }

  getAllCategories() {
      const params: any = {}
    this.productService.getAllCategories(params).subscribe({
      next: (res:any) => {
        if (res?.flag === 1) {
          this.categoryArray = res?.data;
        } else {
          this.categoryArray = []
        }
      },
      error: (res:any) => {
        this.categoryArray = []
      }
    })
      
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.formData.append('images', files[i]);
      }
      console.log("images", this.formData.getAll('images'));
      console.log("images", files);
      
      // this.uploadImages(formData);
    }
  }


  get
  
  
  
  logout() {

    console.log("logout fn>>>>>>>>>>>");
    
       localStorage.removeItem('user_auth')
       localStorage.removeItem('usd');

       this.router.navigate(['/login'])
  }


}
