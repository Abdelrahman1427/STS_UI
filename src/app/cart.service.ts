import { Injectable } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
  categoryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: { product: Product, quantity: number }[] = [];

  constructor() { }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product === product);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }
  

  removeFromCart(product: Product): void {
    this.cartItems = this.cartItems.filter(item => item.product !== product);
  }

  updateQuantity(product: Product, quantity: number): void {
    const item = this.cartItems.find(item => item.product === product);
    if (item) {
      item.quantity = quantity;
      if (quantity === 0) {
        this.removeFromCart(product);
      }
    }
  }

  isProductInCart(product: Product): boolean {
    return this.cartItems.some(item => item.product === product);
  }

  getProductQuantity(product: Product): number {
    const item = this.cartItems.find(item => item.product === product);
    return item ? item.quantity : 0;
  }
}
