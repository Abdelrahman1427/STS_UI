import { Component, OnInit } from '@angular/core';
import { CartService } from '../../cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.loadCartItems();
  }

  getTotal(): number {
    return this.cartService.cartItems
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  removeItem(cartId: number): void {
    this.cartService.removeFromCart(cartId);
  }

  updateQuantity(cartId: number, productId: number, quantity: number): void {
    const currentQuantity = this.cartService.getProductQuantity(cartId);
    const newQuantity = currentQuantity + quantity;

    if (newQuantity <= 0) {
      this.cartService.removeFromCart(cartId);
    } else {
      this.cartService.updateQuantity(cartId, productId, newQuantity);
    }
  }
}
