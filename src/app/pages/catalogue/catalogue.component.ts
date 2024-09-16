import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  pictureUrl: string;
  categoryName: string;
}
interface CartItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule ,MatPaginator],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filterTerm: string = '';

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

  }
  loadProducts(pageIndex: number, pageSize: number): void {
    const body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortingDTO: {
        orderBy: 'string',
        isOrderAsc: true
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

  onPageChange(event: PageEvent): void {
    this.loadProducts(event.pageIndex, event.pageSize);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.filterTerm.toLowerCase())
    );
  }
}
