export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface Order {
  id: number;
  userId: number;
  products: { productId: number; quantity: number }[];
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface adminDAta {
  id?: string;
  username: string;
  email: string;
  password?: string;
  isActive?: boolean;
}
