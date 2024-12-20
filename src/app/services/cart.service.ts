import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartKey = 'cart';

  constructor() { }

  getCartItems(): any[] {
    const cartData = localStorage.getItem(this.cartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  addToCart(item: any){
    let cartItems = this.getCartItems();
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    const obj: any = {
      isExisting: false
    }

    if (existingItem) {
      obj['isExisting'] = true
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    this.updateCart(cartItems);
    return obj;
  }

  removeFromCart(item: any): void {
    let cartItems = this.getCartItems();
    cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
    this.updateCart(cartItems);
  }

  async updateQuantity(item: any, quantity: number){
    let cartItems = this.getCartItems();
    const updatedItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (updatedItem) {
      updatedItem.quantity = quantity;
      this.updateCart(cartItems);
    }
  }

  getTotalItems(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private updateCart(cartItems: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

}
