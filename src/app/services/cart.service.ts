import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/cartItem.model'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/cartitems`;

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  getCartItem(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`);
  }

  addToCart(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, cartItem);
  }

  updateCartItem(id: number, cartItem: CartItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cartItem);
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



  
}
