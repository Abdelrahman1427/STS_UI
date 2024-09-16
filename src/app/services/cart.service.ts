import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddToCart, CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  addItem: AddToCart[] = [];

  constructor(private http: HttpClient) { }


  addToCartBE(addItem: AddToCart): Observable<AddToCart> {
    return this.http.post<AddToCart>(`${environment.apiUrl}/CartItem/Add`, addItem);
  }

  removeFromCartService(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/CartItem/Delete/${id}`);
  }
  updateCartItem(id: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/CartItem/UpdateQuantity/${id}`, { quantity });
  }


  loadCartItems(): void {
    this.http.get<CartItem[]>(`${environment.apiUrl}/CartItem/GetLookUp`)
      .subscribe({
        next: items => this.cartItems = items,
        error: error => console.error('Error fetching cart items:', error)
      });
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const addToCart: AddToCart = { productId: product.id, quantity: 1 };
      this.addToCartBE(addToCart).subscribe({
        next: response => this.addItem.push(response),
        error: error => console.error('Error adding item to cart:', error)
      });
    }
  }

  removeFromCart(cartId: number): void {
    this.removeFromCartService(cartId).subscribe({
      next: () => this.cartItems = this.cartItems.filter(item => item.id !== cartId),
      error: error => console.error('Error removing item from cart:', error)
    });
  }

  updateQuantity(cartId: number, productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === cartId);
    if (item) {
      item.quantity = quantity;
      if (quantity === 0) {
        this.removeFromCart(cartId);
      }
      this.updateCartItem(cartId, quantity).subscribe({
        error: error => console.error('Error updating quantity:', error)
      });
    }
  }

  isProductInCart(Product: Product): boolean {
    return this.cartItems.some(item => item.productId === Product.id);
  }

  getProductQuantity(cartItemId: number): number {
    const item = this.cartItems.find(item => item.id === cartItemId);
    return item ? item.quantity : 0;
  }

  getTotalPrice(): number {
    return this.cartItems
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  getTotalQuantity(): number {
    return this.cartItems
      .reduce((total, item) => total + (item.quantity), 0);
  }
}
