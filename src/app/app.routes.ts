// app.routes.ts
import { Routes } from '@angular/router';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { CartComponent } from './pages/cart/cart.component';


export const routes: Routes = [
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'cart', component: CartComponent }

  
];
