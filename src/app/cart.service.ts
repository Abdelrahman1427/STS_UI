import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
  categoryName: string;
}
interface AddToCart {
  productId: number;
  quantity: number;
}
interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
   cartItems: CartItem[] = [];
   addItem: AddToCart[] = [];

   private apiUrl = 'https://localhost:7193/CartItem/Add';

   constructor(private http: HttpClient) { }


   loadCartItems(): void {
    this.http.get<CartItem[]>('https://localhost:7193/CartItem/GetLookUp').subscribe(
      items => {
        this.cartItems = items;
      },
      error => {
        console.error('Error fetching cart items:', error);
  
      }
    );
  }

  addToCartBE(addItem: AddToCart): Observable<AddToCart> {
    return this.http.post<AddToCart>(this.apiUrl, addItem);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.productId=== product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const addToCart: AddToCart = {
        productId: product.id,
        quantity: 1
      };
      this.addToCartBE(addToCart).subscribe(response => {
        this.addItem.push(response);
      }, error => {
        console.error('Error fetching products:', error);
      });
    }
  }

  removeFromCartService(id: number): Observable<void> {
    return this.http.delete<void>(`${"https://localhost:7193/CartItem/Delete"}/${id}`);
  }
  removeFromCart(cartId: number): void {
    const cartItems = this.cartItems[cartId];
    this.removeFromCartService(cartId).subscribe(() => {
      this.cartItems.splice(cartId, 1);
    }, error => {
      console.error('Error fetching products:', error);
    });
  }
  updateCartItem(id: number, quantity: Number): Observable<void> {
    return this.http.put<void>(`${"https://localhost:7193/CartItem/UpdateQuantity"}/${id}`, { quantity });
  }
  
  updateQuantity(cartId: number, productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === cartId);
    if (item) {
      item.quantity = quantity;
      if (quantity === 0) {
        this.removeFromCart(cartId);
      }
      this.updateCartItem(cartId, quantity).subscribe(() => {
      }, error => {
        console.error('Error fetching products:', error);
      });
    }

  }

  isProductInCart(product: Product): boolean {
    return this.cartItems.some(item => item.productId === product.id);
  }

  getProductQuantity(cartItemId: number): number {
    const item = this.cartItems.find(item => item.id === cartItemId);
    return item ? item.quantity : 0;
  }

  
}
