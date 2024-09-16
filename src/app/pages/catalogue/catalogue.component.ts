import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';




@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule ,MatPaginator],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  selectedCategoryId: number  = 0;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  private apiUrl = 'https://localhost:7193/Product/GetPage';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    public cartService: CartService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.cartService.loadCartItems();
    this.loadProducts(this.pageIndex, this.pageSize); 
    this.loadCategories();
  }
  onCategoryChange(event: any): void {
    this.pageIndex = 0; // Reset pagination when filtering
    this.loadProducts(this.pageIndex, this.pageSize); // Reload products with the selected category filter
  }
  loadCategories(): void {
    this.http.get<Category[]>('https://localhost:7193/Category/GetLookUp').subscribe(
      items => {
        this.categories = items;
      },
      error => {
        console.error('Error fetching categories:', error);
  
      }
    );
  }

  loadProducts(pageIndex: number, pageSize: number): void {
    const body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortingDTO: {
        orderBy: 'string',
        isOrderAsc: true
      },
      filter: {
        categoryId: this.selectedCategoryId // Pass the selected category ID (null if no filter)
      }
    };

    this.http.post<any>(this.apiUrl, body).subscribe(
      response => {
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
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

 // Handle pagination change
 onPageChange(event: any): void {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.loadProducts(this.pageIndex, this.pageSize);
}

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
