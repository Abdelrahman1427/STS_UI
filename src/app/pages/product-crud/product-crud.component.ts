import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.css']
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { id: 0, name: '', price: 0, qty: 0, isVisible: true }; // Default to visible
  currentProduct: Product = { id: 0, name: '', price: 0, qty: 0, isVisible: true }; // Default to visible

  editProductId: number | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  openEdit(product: Product): void {
    this.editProductId = product.id;
    this.currentProduct = { ...product }; // Copy the product data
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(product => {
      this.products.push(product);
      this.newProduct = { id: 0, name: '', price: 0, qty: 0 , isVisible: true}; // Reset the new product
    });
  }

  updateProduct(id: number): void {
    this.productService.updateProduct(id, this.currentProduct).subscribe(() => {
      const index = this.products.findIndex(p => p.id === id);
      if (index !== -1) {
        this.products[index] = { ...this.currentProduct }; // Update the product in the list
        this.editProductId = null; // Reset edit mode
      }
    });
  }

  cancelEdit(): void {
    this.editProductId = null; // Reset edit mode
    this.currentProduct = { id: 0, name: '', price: 0, qty: 0 , isVisible: true}; // Reset current product
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
  toggleVisibility(product: Product): void {
    product.isVisible = !product.isVisible; 
    this.productService.updateProduct(product.id, product).subscribe(() => {
    });
  }


}
