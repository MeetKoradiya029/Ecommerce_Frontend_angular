import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  providers:[ProductService, CartService],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent implements OnInit{

  productId:any
  productDetailsObj: any = {}
  isLoggedIn:boolean = false;
  user:any;

  constructor(
    private productService: ProductService,
    private activatedRouter: ActivatedRoute,
    private cartService: CartService
  ) {

    this.user = localStorage.getItem('user_auth');
    if (this.user) {
      this.isLoggedIn = true
    }

    console.log("activated Route : >>>>", this.activatedRouter);
    if(this.activatedRouter.snapshot?.params) {
      this.productId = this.activatedRouter.snapshot?.params['id']
    }
  }

  ngOnInit() {
      if (this.productId) {
        this.getProductDetails()
      }
  }

  getProductDetails () {
    const params:any = {
      id : this.productId
    }
      this.productService.getProductById(params).subscribe({
        next: (res:any) => {
          if (res?.flag === 1) {
            this.productDetailsObj = res?.data;
          }
        },
        error: (error:any) => {}
      })
  }

  addToCart(obj:any) {
    const cartItemObj: any = {
      ...obj,
    }
     this.cartService.addToCart(cartItemObj);
  }


}
