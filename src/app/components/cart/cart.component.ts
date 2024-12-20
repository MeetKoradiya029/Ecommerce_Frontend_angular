import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, CurrencyPipe, RouterModule, TableModule, TagModule, ButtonModule],
  providers: [CartService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Array<any> = []
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.getAllCartItems()
  }


  getAllCartItems() {
    this.cartItems = this.cartService.getCartItems() || [];
  }

  increaseQuantity(obj: any) {

    if (obj.quantity >= 0) {
      const updatedQuantity = obj?.quantity + 1;
      this.cartService.updateQuantity(obj, updatedQuantity);
      this.cartItems = this.cartService.getCartItems();
    }
    
  }
  decreaseQuantity(obj: any) {
    if (obj.quantity > 1) {
      const updatedQuantity = obj?.quantity - 1;
      this.cartService.updateQuantity(obj, updatedQuantity);
      this.cartItems = this.cartService.getCartItems();
    }
  }
  



  removeItem(item: any): void {
      this.cartService.removeFromCart(item);
      this.cartItems = this.cartService.getCartItems();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems()
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
