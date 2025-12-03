export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  hoverImage: string;
  description: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export enum ViewState {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}