// app.routes.ts
import { Routes } from '@angular/router';
import { ProductCrudComponent } from './pages/product-crud/product-crud.component';
import { CartCrudComponent } from './pages/cart-crud/cart-crud.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { CartComponent } from './pages/cart/cart.component';


export const routes: Routes = [
    { path: '', redirectTo: 'qtys', pathMatch: 'full' },
    { path: 'products', component: ProductCrudComponent },
  { path: 'cartCrud', component: CartCrudComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'cart', component: CartComponent }

  
];
