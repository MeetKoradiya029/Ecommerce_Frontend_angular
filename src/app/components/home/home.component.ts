import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PaginationService } from '../../services/pagination.service';
import { PAGE_SIZE, get_pagination_data } from '../../utils/utils';
import { PaginationComponent } from "../../common/pagination/pagination.component";
import { CartService } from '../../services/cart.service';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-home',
    standalone: true,
    providers: [ProductService, { provide: ToastrService, useClass: ToastrService }, CurrencyPipe, PaginationService, CartService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [NgIf,NgClass, RouterModule, ToastrModule, CurrencyPipe, PaginationComponent, NgFor, SliderModule, FormsModule, NgSelectModule]
})
export class HomeComponent {

  productsArray : Array<any> = [];
  totalRecords!: number;
  pagination: any;
  currentPage!: number;
  skip: number = 0;
  isLoggedIn:boolean = false;
  user:any;
  rangeValues: number[] = [1, 30000];
  minValue:number = 1;
  maxValue:number = 30000;

  categoryArray: Array<any> = [];
  selectedCategory: number = 0;
  searchTerm: string;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private cartService: CartService,
    private router: Router
  ) {
    this.user = localStorage.getItem('user_auth');

    if (this.user) {
      this.isLoggedIn = true
    }
    this.getAllProducts()
    this.getAllCategories()
  }

  // async getPaginationData() {
  //     const response = await lastValueFrom(this.productService.getTotalRecords());

  //     if (response?.flag === 1) {
  //       this.totalRecords = response?.total_records;
  //       this.pagination = this.paginationService.getPage(this.totalRecords,this.currentPage);
  //       this.getAllProducts()
  //     }
  // }


  getAllProducts(payload?:any) {
    const params: any = {
      category_id: this.selectedCategory,
      skip: this.skip,
      limit: PAGE_SIZE
    }

    if (this.minValue) {
      params['min_price'] = this.minValue;
    }

    if (this.maxValue) {
      params['max_price'] = this.maxValue;
    }

    if (this.searchTerm) {
      params['search_term'] = this.searchTerm
    }

    this.productService.getAllProducts(payload ? payload : params).subscribe({
      next: (response:any) =>  {
        if (response?.flag === 1) {
          this.totalRecords = response?.total_records;
          this.pagination = this.paginationService.getPage(this.totalRecords,this.currentPage);
          console.log("pagination >>>", this.pagination);
          
          this.productsArray = response?.data;
        } else {
          // this.toastrService.error(response?.message);
          this.productsArray = []
        }
      },  
      error: (err:any) => {
        this.productsArray = []
        // this.toastrService.error(err?.error?.message);
      }
    })
  }

  addToCart(obj:any) {
    const cartItemObj: any = {
      ...obj,
    }
     const isExistingObj = this.cartService.addToCart(cartItemObj);
     console.log("isExistingObj>>>>", isExistingObj.isExisting);
     if (isExistingObj.isExisting) {
        this.toastrService.error("Product already exist in you cart! please check your cart");
     } else {
      this.toastrService.success("Product added in you cart !");
     }
  }


  onChangeMinRangeInput(event:any) {
    console.log("min dropdown event >>>", event.target.value);
    const value = event?.target.value;
    if (value) {
      this.minValue = parseInt(value)
    }
    this.rangeValues = [];
    if (value && value < this.maxValue) {
      if (this.maxValue) {
        this.rangeValues[0] = this.minValue;
        this.rangeValues[1] = this.maxValue;
      } else {
        this.rangeValues[0] = this.minValue;
        this.rangeValues[1] = 30000
      }
      this.getAllProducts();
    } else {
      this.rangeValues[0] = this.minValue;
      this.rangeValues[1] = this.maxValue
    }
    
  }

  onChangeMaxRangeInput(event:any) {
    console.log("max dropdown event >>>", event.target.value);
    const value = event?.target.value;
    if (value) {
      this.maxValue = parseInt(value)
    }
    this.rangeValues = [];
    if (value && value > this.minValue) {
      if (this.minValue) { 
        this.rangeValues[0] = this.minValue;
        this.rangeValues[1] = this.maxValue;
      } else {
        this.rangeValues[0] = this.minValue;
        this.rangeValues[1] = this.maxValue
      }

      this.getAllProducts();
    } else {
      this.rangeValues[0] = this.minValue;
      this.rangeValues[1] = this.maxValue
    }
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
  

 getProductsByCategory(obj:any) {
    // obj?.category_id
 }


  
  getPage(page: number) {
    this.currentPage = page;
    this.skip = get_pagination_data(page);
    console.log("skip >>>", this.skip);
    
    this.getAllProducts();
  }

  logout() {

    console.log("logout fn>>>>>>>>>>>");
    
       localStorage.removeItem('user_auth')
       localStorage.removeItem('usd');

       this.router.navigate(['/login'])
  }

  onChangeCategoryDropdown(event:any) {

    if (event) {
      this.selectedCategory = event?.id;

      this.getAllProducts();
    } else {
      this.selectedCategory = 0;
      const payload:any = {
        category_id:0,
        skip:this.skip,
        limit:PAGE_SIZE
      }

      this.getAllProducts(payload);

    }
    console.log("category event >>>>>>>", event);
    
  }

  onPriceRangeChange(event:any) {
    console.log("price range event >>>>", event);
    if (event) {
      const minValue = event?.values[0];
      const maxValue = event?.values[1];
      this.minValue = minValue;
      this.maxValue = maxValue;

      this.getAllProducts();
    }
    
  }

  onSearchInput(event:any) {
    const search_term = event?.target.value;
    if (search_term) {
        console.log(" search term >>>>", search_term);
        this.searchTerm = search_term;
        this.getAllProducts();
    } else {
      this.getAllProducts();
    }
  }

} 
