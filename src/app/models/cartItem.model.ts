export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface AddToCart {
  productId: number;
  quantity: number;
}