// app.routes.ts
import { Routes } from '@angular/router';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';


export const routes: Routes = [
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutPageComponent }

  
];
