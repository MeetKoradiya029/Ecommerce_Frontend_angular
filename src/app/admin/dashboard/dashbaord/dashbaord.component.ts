import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { PAGE_SIZE, get_pagination_data } from '../../../utils/utils';
import { CurrencyPipe } from '@angular/common';
import { PaginationService } from '../../../services/pagination.service';
import { PaginationComponent } from "../../../common/pagination/pagination.component";
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DataService } from '../../../services/data.service';
import { BITS_MAPPING } from '../../../utils/constants';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-dashbaord',
    standalone: true,
    providers: [
        ProductService,
        CurrencyPipe,
        UserService,
        ToastrService
    ],
    templateUrl: './dashbaord.component.html',
    styleUrl: './dashbaord.component.css',
    imports: [CurrencyPipe, PaginationComponent, RouterModule, DialogModule, NgSelectModule, FormsModule, ReactiveFormsModule],
})
export class DashbaordComponent implements AfterViewInit, OnInit{
  skip: number = 0;
  productsArray: Array<any> = []
  totalRecords!: number;
  pagination: any;
  currentPage!: number;
  userDetailObj: any = {};
  activeStatus:any = BITS_MAPPING
  showAddProductDialog: boolean = false;



  productForm!: UntypedFormGroup

  selectedCar!:any
  categoryArray: Array<any> = []
  idEditing: boolean = false;
  productId:any;
  formData!: FormData;
  productObj: any;

  constructor(
    private productService: ProductService,
    private paginationService: PaginationService,
    private router: Router,
    private userService: UserService,
    private dataService: DataService,
    private fBuilder: UntypedFormBuilder,
    private tostrService : ToastrService
    // private activatedRoute : ActivatedRoute
  ) {
    this.initializeProductForm();
    this.getUserDetails()
    this.formData = new FormData();
  }
  
  ngOnInit(): void {
      this.getAllProducts();
  }

  ngAfterViewInit(){
      this.toggleSidebar()
  }

  getAllProducts() {
    const params: any = {
      skip: this.skip,
      limit: PAGE_SIZE
    }

    this.productService.getAllProducts(params).subscribe({
      next: (res:any) => {
        if (res?.flag === 1) {
          this.totalRecords = res?.total_records;
          this.pagination = this.paginationService.getPage(this.totalRecords,this.currentPage);
          this.productsArray = res?.data;
        }
      },
      error: (error:any) => {}
    })

  }

  initializeProductForm() {
    this.productForm = this.fBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])],
      stock_quantity: [null, Validators.compose([Validators.required])],
      category_id: [null, Validators.compose([Validators.required])],
      is_active: [true]
    });

    this.formData = new FormData();
  }

  getUserDetails() {
    this.dataService.userDetailsObs.subscribe((user:any) => {
      this.userDetailObj = user;
      console.log("userXDetails>>>>>", user);
      
    })
  }

  activeInactiveProduct(event: any, obj:any) {
    console.log("event >>>", event);

    const isActive: boolean = event?.target.checked;
    const payload : any = {
      id : obj?.id,
      name: obj?.name,
      description: obj?.description,
      price: obj?.price,
      stock_quantity: obj?.stock_quantity,
      category_id: obj?.category_id,
      is_active: isActive
    }

    this.productService.updateProduct(payload).subscribe({
      next: (res:any) => {

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

  submitForm (productForm:FormGroup) {
    const formValues:any = productForm.value;

    if (this.productForm.valid) {
        console.log("product form values >>>>", formValues);


        this.formData.append("name", formValues?.name);
        this.formData.append("description", formValues?.description);
        this.formData.append("price", formValues?.price);
        this.formData.append("stock_quantity", formValues?.stock_quantity);
        this.formData.append("category_id", formValues?.category_id);

        if (this.formData) {
          console.log("images", this.formData.getAll('images'));
          formValues['images'] = this.formData.getAll('images');
        } 

        if (this.productId) {
          this.formData.append("id", this.productId)
          this.formData.append("is_active", this.productObj?.is_active)
          this.productService.updateProduct(this.formData).subscribe({
            next: (res: any) => {
              if (res?.flag === 1) {
                this.productForm.reset();
                this.tostrService.success("Product updateed Successfully");
                this.getAllProducts()
                this.showAddProductDialog = false;

                this.formData.delete("name");
                this.formData.delete("description");
                this.formData.delete("price");
                this.formData.delete("stock_quantity");
                this.formData.delete("category_id");
                this.formData.delete("images");
                this.formData.delete("id");
                this.formData.delete("is_active");

              } else {
                this.formData.delete("name");
                this.formData.delete("description");
                this.formData.delete("price");
                this.formData.delete("stock_quantity");
                this.formData.delete("category_id");
                this.formData.delete("images");
                this.formData.delete("id");
                this.formData.delete("is_active");
                this.tostrService.error(res?.error)
              }
            },
            error: (error:any) => {
              this.formData.delete("name");
                this.formData.delete("description");
                this.formData.delete("price");
                this.formData.delete("stock_quantity");
                this.formData.delete("category_id");
                this.formData.delete("images");
                this.formData.delete("id");
                this.formData.delete("is_active");
            }
          })
        } else {
          const isActive = true
          this.formData.append("is_active", formValues?.is_active)
          this.productService.addProduct(this.formData).subscribe({
            next: (res:any) => {
              if (res?.flag === 1) {
                this.productForm.reset();
                this.tostrService.success("Product Added Successfully")
                this.showAddProductDialog = false;
                this.getAllProducts();

                this.formData.delete("name");
                this.formData.delete("description");
                this.formData.delete("price");
                this.formData.delete("stock_quantity");
                this.formData.delete("category_id");
                this.formData.delete("images");
                this.formData.delete("is_active");

              } else {
                this.formData.delete("name");
                this.formData.delete("description");
                this.formData.delete("price");
                this.formData.delete("stock_quantity");
                this.formData.delete("category_id");
                this.formData.delete("images");
                this.formData.delete("is_active");
                this.tostrService.error(res?.error)
              }
            }, error:(err:any) => {
              this.formData.delete("name");
              this.formData.delete("description");
              this.formData.delete("price");
              this.formData.delete("stock_quantity");
              this.formData.delete("category_id");
              this.formData.delete("images");
              this.formData.delete("is_active");
              this.tostrService.error(err?.error?.error);
            }
          })
        }
        
    } else {
      this.productForm.markAllAsTouched()
    }
  }

  getPage(page: number) {
    this.currentPage = page;
    this.skip = get_pagination_data(page);
    console.log("skip >>>", this.skip);
    
    this.getAllProducts();
  }


  toggleSidebar() {
    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
    const mainWrapper = document.querySelector(".main-wrapper");
    const menuToggleButton = document.querySelector("#menu-toggle");
    const menuToggleButtonIcon = document.querySelector("#menu-toggle i");
    const overlay = document.querySelector(".overlay");
  
    menuToggleButton?.addEventListener("click", () => {
      sidebarNavWrapper?.classList.toggle("active");
      overlay?.classList.add("active");
      mainWrapper?.classList.toggle("active");
  
      if (document.body.clientWidth > 1200) {
        if (menuToggleButtonIcon?.classList.contains("lni-chevron-left")) {
          menuToggleButtonIcon.classList.remove("lni-chevron-left");
          menuToggleButtonIcon.classList.add("lni-menu");
        } else {
          menuToggleButtonIcon?.classList.remove("lni-menu");
          menuToggleButtonIcon?.classList.add("lni-chevron-left");
        }
      } else {
        if (menuToggleButtonIcon?.classList.contains("lni-chevron-left")) {
          menuToggleButtonIcon.classList.remove("lni-chevron-left");
          menuToggleButtonIcon.classList.add("lni-menu");
        }
      }
    });
    overlay?.addEventListener("click", () => {
      sidebarNavWrapper?.classList.remove("active");
      overlay.classList.remove("active");
      mainWrapper?.classList.remove("active");
    });
  }






  // --------------------------Chart------------------------------

  // const ctx1 = document.getElementById("Chart1").getContext("2d");
  //     const chart1 = new Chart(ctx1, {
  //       type: "line",
  //       data: {
  //         labels: [
  //           "Jan",
  //           "Fab",
  //           "Mar",
  //           "Apr",
  //           "May",
  //           "Jun",
  //           "Jul",
  //           "Aug",
  //           "Sep",
  //           "Oct",
  //           "Nov",
  //           "Dec",
  //         ],
  //         datasets: [
  //           {
  //             label: "",
  //             backgroundColor: "transparent",
  //             borderColor: "#365CF5",
  //             data: [
  //               600, 800, 750, 880, 940, 880, 900, 770, 920, 890, 976, 1100,
  //             ],
  //             pointBackgroundColor: "transparent",
  //             pointHoverBackgroundColor: "#365CF5",
  //             pointBorderColor: "transparent",
  //             pointHoverBorderColor: "#fff",
  //             pointHoverBorderWidth: 5,
  //             borderWidth: 5,
  //             pointRadius: 8,
  //             pointHoverRadius: 8,
  //             cubicInterpolationMode: "monotone", // Add this line for curved line
  //           },
  //         ],
  //       },
  //       options: {
  //         plugins: {
  //           tooltip: {
  //             callbacks: {
  //               labelColor: function (context) {
  //                 return {
  //                   backgroundColor: "#ffffff",
  //                   color: "#171717"
  //                 };
  //               },
  //             },
  //             intersect: false,
  //             backgroundColor: "#f9f9f9",
  //             title: {
  //               fontFamily: "Plus Jakarta Sans",
  //               color: "#8F92A1",
  //               fontSize: 12,
  //             },
  //             body: {
  //               fontFamily: "Plus Jakarta Sans",
  //               color: "#171717",
  //               fontStyle: "bold",
  //               fontSize: 16,
  //             },
  //             multiKeyBackground: "transparent",
  //             displayColors: false,
  //             padding: {
  //               x: 30,
  //               y: 10,
  //             },
  //             bodyAlign: "center",
  //             titleAlign: "center",
  //             titleColor: "#8F92A1",
  //             bodyColor: "#171717",
  //             bodyFont: {
  //               family: "Plus Jakarta Sans",
  //               size: "16",
  //               weight: "bold",
  //             },
  //           },
  //           legend: {
  //             display: false,
  //           },
  //         },
  //         responsive: true,
  //         maintainAspectRatio: false,
  //         title: {
  //           display: false,
  //         },
  //         scales: {
  //           y: {
  //             grid: {
  //               display: false,
  //               drawTicks: false,
  //               drawBorder: false,
  //             },
  //             ticks: {
  //               padding: 35,
  //               max: 1200,
  //               min: 500,
  //             },
  //           },
  //           x: {
  //             grid: {
  //               drawBorder: false,
  //               color: "rgba(143, 146, 161, .1)",
  //               zeroLineColor: "rgba(143, 146, 161, .1)",
  //             },
  //             ticks: {
  //               padding: 20,
  //             },
  //           },
  //         },
  //       },
  //     });
  //     // =========== chart one end

  //     // =========== chart two start
  //     const ctx2 = document.getElementById("Chart2").getContext("2d");
  //     const chart2 = new Chart(ctx2, {
  //       type: "bar",
  //       data: {
  //         labels: [
  //           "Jan",
  //           "Fab",
  //           "Mar",
  //           "Apr",
  //           "May",
  //           "Jun",
  //           "Jul",
  //           "Aug",
  //           "Sep",
  //           "Oct",
  //           "Nov",
  //           "Dec",
  //         ],
  //         datasets: [
  //           {
  //             label: "",
  //             backgroundColor: "#365CF5",
  //             borderRadius: 30,
  //             barThickness: 6,
  //             maxBarThickness: 8,
  //             data: [
  //               600, 700, 1000, 700, 650, 800, 690, 740, 720, 1120, 876, 900,
  //             ],
  //           },
  //         ],
  //       },
  //       options: {
  //         plugins: {
  //           tooltip: {
  //             callbacks: {
  //               titleColor: function (context) {
  //                 return "#8F92A1";
  //               },
  //               label: function (context) {
  //                 let label = context.dataset.label || "";

  //                 if (label) {
  //                   label += ": ";
  //                 }
  //                 label += context.parsed.y;
  //                 return label;
  //               },
  //             },
  //             backgroundColor: "#F3F6F8",
  //             titleAlign: "center",
  //             bodyAlign: "center",
  //             titleFont: {
  //               size: 12,
  //               weight: "bold",
  //               color: "#8F92A1",
  //             },
  //             bodyFont: {
  //               size: 16,
  //               weight: "bold",
  //               color: "#171717",
  //             },
  //             displayColors: false,
  //             padding: {
  //               x: 30,
  //               y: 10,
  //             },
  //         },
  //         },
  //         legend: {
  //           display: false,
  //           },
  //         legend: {
  //           display: false,
  //         },
  //         layout: {
  //           padding: {
  //             top: 15,
  //             right: 15,
  //             bottom: 15,
  //             left: 15,
  //           },
  //         },
  //         responsive: true,
  //         maintainAspectRatio: false,
  //         scales: {
  //           y: {
  //             grid: {
  //               display: false,
  //               drawTicks: false,
  //               drawBorder: false,
  //             },
  //             ticks: {
  //               padding: 35,
  //               max: 1200,
  //               min: 0,
  //             },
  //           },
  //           x: {
  //             grid: {
  //               display: false,
  //               drawBorder: false,
  //               color: "rgba(143, 146, 161, .1)",
  //               drawTicks: false,
  //               zeroLineColor: "rgba(143, 146, 161, .1)",
  //             },
  //             ticks: {
  //               padding: 20,
  //             },
  //           },
  //         },
  //         plugins: {
  //           legend: {
  //             display: false,
  //           },
  //           title: {
  //             display: false,
  //           },
  //         },
  //       },
  //     });
  //     // =========== chart two end

  //     // =========== chart three start
  //     const ctx3 = document.getElementById("Chart3").getContext("2d");
  //     const chart3 = new Chart(ctx3, {
  //       type: "line",
  //       data: {
  //         labels: [
  //           "Jan",
  //           "Feb",
  //           "Mar",
  //           "Apr",
  //           "May",
  //           "Jun",
  //           "Jul",
  //           "Aug",
  //           "Sep",
  //           "Oct",
  //           "Nov",
  //           "Dec",
  //         ],
  //         datasets: [
  //           {
  //             label: "Revenue",
  //             backgroundColor: "transparent",
  //             borderColor: "#365CF5",
  //             data: [80, 120, 110, 100, 130, 150, 115, 145, 140, 130, 160, 210],
  //             pointBackgroundColor: "transparent",
  //             pointHoverBackgroundColor: "#365CF5",
  //             pointBorderColor: "transparent",
  //             pointHoverBorderColor: "#365CF5",
  //             pointHoverBorderWidth: 3,
  //             pointBorderWidth: 5,
  //             pointRadius: 5,
  //             pointHoverRadius: 8,
  //             fill: false,
  //             tension: 0.4,
  //           },
  //           {
  //             label: "Profit",
  //             backgroundColor: "transparent",
  //             borderColor: "#9b51e0",
  //             data: [
  //               120, 160, 150, 140, 165, 210, 135, 155, 170, 140, 130, 200,
  //             ],
  //             pointBackgroundColor: "transparent",
  //             pointHoverBackgroundColor: "#9b51e0",
  //             pointBorderColor: "transparent",
  //             pointHoverBorderColor: "#9b51e0",
  //             pointHoverBorderWidth: 3,
  //             pointBorderWidth: 5,
  //             pointRadius: 5,
  //             pointHoverRadius: 8,
  //             fill: false,
  //             tension: 0.4,
  //           },
  //           {
  //             label: "Order",
  //             backgroundColor: "transparent",
  //             borderColor: "#f2994a",
  //             data: [180, 110, 140, 135, 100, 90, 145, 115, 100, 110, 115, 150],
  //             pointBackgroundColor: "transparent",
  //             pointHoverBackgroundColor: "#f2994a",
  //             pointBorderColor: "transparent",
  //             pointHoverBorderColor: "#f2994a",
  //             pointHoverBorderWidth: 3,
  //             pointBorderWidth: 5,
  //             pointRadius: 5,
  //             pointHoverRadius: 8,
  //             fill: false,
  //             tension: 0.4,
  //           },
  //         ],
  //       },
  //       options: {
  //         plugins: {
  //           tooltip: {
  //             intersect: false,
  //             backgroundColor: "#fbfbfb",
  //             titleColor: "#8F92A1",
  //             bodyColor: "#272727",
  //             titleFont: {
  //               size: 16,
  //               family: "Plus Jakarta Sans",
  //               weight: "400",
  //             },
  //             bodyFont: {
  //               family: "Plus Jakarta Sans",
  //               size: 16,
  //             },
  //             multiKeyBackground: "transparent",
  //             displayColors: false,
  //             padding: {
  //               x: 30,
  //               y: 15,
  //             },
  //             borderColor: "rgba(143, 146, 161, .1)",
  //             borderWidth: 1,
  //             enabled: true,
  //           },
  //           title: {
  //             display: false,
  //           },
  //           legend: {
  //             display: false,
  //           },
  //         },
  //         layout: {
  //           padding: {
  //             top: 0,
  //           },
  //         },
  //         responsive: true,
  //         // maintainAspectRatio: false,
  //         legend: {
  //           display: false,
  //         },
  //         scales: {
  //           y: {
  //             grid: {
  //               display: false,
  //               drawTicks: false,
  //               drawBorder: false,
  //             },
  //             ticks: {
  //               padding: 35,
  //             },
  //             max: 350,
  //             min: 50,
  //           },
  //           x: {
  //             grid: {
  //               drawBorder: false,
  //               color: "rgba(143, 146, 161, .1)",
  //               drawTicks: false,
  //               zeroLineColor: "rgba(143, 146, 161, .1)",
  //             },
  //             ticks: {
  //               padding: 20,
  //             },
  //           },
  //         },
  //       },
  //     });
  //     // =========== chart three end

  //     // ================== chart four start
  //      ctx4 = document.getElementById("Chart4")?.getContext("2d");
  //     const chart4 = new Chart(ctx4, {
  //       type: "bar",
  //       data: {
  //         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //         datasets: [
  //           {
  //             label: "",
  //             backgroundColor: "#365CF5",
  //             borderColor: "transparent",
  //             borderRadius: 20,
  //             borderWidth: 5,
  //             barThickness: 20,
  //             maxBarThickness: 20,
  //             data: [600, 700, 1000, 700, 650, 800],
  //           },
  //           {
  //             label: "",
  //             backgroundColor: "#d50100",
  //             borderColor: "transparent",
  //             borderRadius: 20,
  //             borderWidth: 5,
  //             barThickness: 20,
  //             maxBarThickness: 20,
  //             data: [690, 740, 720, 1120, 876, 900],
  //           },
  //         ],
  //       },
  //       options: {
  //         plugins: {
  //           tooltip: {
  //             backgroundColor: "#F3F6F8",
  //             titleColor: "#8F92A1",
  //             titleFontSize: 12,
  //             bodyColor: "#171717",
  //             bodyFont: {
  //               weight: "bold",
  //               size: 16,
  //             },
  //             multiKeyBackground: "transparent",
  //             displayColors: false,
  //             padding: {
  //               x: 30,
  //               y: 10,
  //             },
  //             bodyAlign: "center",
  //             titleAlign: "center",
  //             enabled: true,
  //           },
  //           legend: {
  //             display: false,
  //           },
  //         },
  //         layout: {
  //           padding: {
  //             top: 0,
  //           },
  //         },
  //         responsive: true,
  //         // maintainAspectRatio: false,
  //         title: {
  //           display: false,
  //         },
  //         scales: {
  //           y: {
  //             grid: {
  //               display: false,
  //               drawTicks: false,
  //               drawBorder: false,
  //             },
  //             ticks: {
  //               padding: 35,
  //               max: 1200,
  //               min: 0,
  //             },
  //           },
  //           x: {
  //             grid: {
  //               display: false,
  //               drawBorder: false,
  //               color: "rgba(143, 146, 161, .1)",
  //               zeroLineColor: "rgba(143, 146, 161, .1)",
  //             },
  //             ticks: {
  //               padding: 20,
  //             },
  //           },
  //         },
  //       },
  //     });

  // updateProducts(product_id:any) {
  //   this.router.navigateByUrl(`/admin/edit-product/${product_id}`);
  // }

  async toggleAddProductDialog(productObj?:any) {
   await this.getAllCategories();
   if (productObj?.id) {
    this.productId = productObj?.id;
     this.getAndPatchProductDetails(productObj?.id)
    } else {
      this.productId = undefined;
      this.productForm.reset();
    }
    this.showAddProductDialog = true;
  }


  deleteProduct(product_id:any) {
    const params:any = {
      id: product_id
    }
      this.productService.deleteProductById(params).subscribe({
        next: (res:any) => {
          if (res?.flag === 1) {
            console.warn("Product Deleted Successfully !")
            this.getAllProducts();
          }
        },
        error: (error:any) => {}
      })
  } 

  async getAllCategories() {
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


getAndPatchProductDetails (id:any) {
  const params :any = {
    id : id
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


  logout() {

    console.log("logout fn>>>>>>>>>>>");
    
       localStorage.removeItem('user_auth')
       localStorage.removeItem('usd');

       this.router.navigate(['/login'])
  }



}
