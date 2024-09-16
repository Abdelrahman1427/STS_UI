import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

@Component({
  
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterModule ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
  }



}



