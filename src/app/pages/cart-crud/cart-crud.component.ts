import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service'; 
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model'; 

@Component({
  selector: 'app-cart-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-crud.component.html',
  styleUrls: ['./cart-crud.component.css']
})
export class CartCrudComponent implements OnInit {
  visibleProducts: Product[] = [];
  filteredProducts: Product[] = [];
  cart: CartItem[] = [];
  productMap: Map<number, Product> = new Map();
  filterTerm: string = '';
  errorMessage: string | null = null;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadVisibleProducts();
    this.loadCartItems();
  }

  loadVisibleProducts(): void {
    this.productService.getVisibleProducts().subscribe(products => {
      this.visibleProducts = products;
      this.filteredProducts = products;

      products.forEach(product => this.productMap.set(product.id, product));
    }, error => {
      this.handleError(error);
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cart = items;
    }, error => {
      this.handleError(error);
    });
  }

  addToCart(product: Product): void {
    if (product.qty === 0) {
      this.errorMessage = 'Cannot add product with zero quantity to the cart.';
      return;
    }

    const existingCartItem = this.cart.find(item => item.productId === product.id);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      this.updateCartItem(existingCartItem);
    } else {
      const cartItem: CartItem = {
        id: 0,
        productId: product.id,
        quantity: 1
      };

      this.cartService.addToCart(cartItem).subscribe(response => {
        this.cart.push(response);
        this.clearError();
      }, error => {
        this.handleError(error);
      });
    }
  }

  removeFromCart(index: number): void {
    const cartItem = this.cart[index];
    this.cartService.removeFromCart(cartItem.id).subscribe(() => {
      this.cart.splice(index, 1);
      this.clearError();
    }, error => {
      this.handleError(error);
    });
  }

  updateCartItem(cartItem: CartItem): void {
    const product = this.productMap.get(cartItem.productId);
    if (product && product.qty === 0) {
      this.errorMessage = 'Cannot increase quantity for product with zero stock.';
      return;
    }

    this.cartService.updateCartItem(cartItem.id, cartItem).subscribe(() => {
      this.clearError();
    }, error => {
      this.handleError(error);
    });
  }

  calculateTotalPrice(): number {
    return this.cart.reduce((total, item) => {
      const product = this.productMap.get(item.productId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  }

  filterProducts(): void {
    this.filteredProducts = this.visibleProducts.filter(product =>
      product.name.toLowerCase().includes(this.filterTerm.toLowerCase())
    );
  }

  handleError(error: any): void {
    this.errorMessage = error.error || 'An unknown error occurred!';
  }

  clearError(): void {
    this.errorMessage = null;
  }
}
  