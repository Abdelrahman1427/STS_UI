import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginator],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    public cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.loadCartItems();
    this.loadProducts();
    this.loadCategories();
  }

  onCategoryChange(): void {
    this.pageIndex = 0; 
    this.loadProducts(); 
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${environment.apiUrl}/Category/GetLookUp` )
      .subscribe({
        next: items => this.categories = items,
        error: error => console.error('Error fetching categories:', error)
      });
  }

  loadProducts(): void {
    const body = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortingDTO: {
        orderBy: 'string',
        isOrderAsc: true
      },
      filter: {
        categoryId: this.selectedCategoryId
      }
    };

    this.http.post<any>(`${environment.apiUrl}/Product/GetPage`, body)
      .subscribe({
        next: response => {
          if (response && response.entity) {
            this.products = response.entity.items;
            this.totalItems = response.entity.count;
            this.pageSize = response.entity.size;
            this.pageIndex = response.entity.index;

            if (this.paginator) {
              this.paginator.pageIndex = this.pageIndex;
              this.paginator.pageSize = this.pageSize;
              this.paginator.length = this.totalItems;
            }
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        error: error => console.error('Error fetching products:', error)
      });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
