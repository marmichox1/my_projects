
export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive';
  revenue: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
  status: 'Active' | 'Paused';
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  status: OrderStatus;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  dueDate: string;
  status: 'Todo' | 'In Progress' | 'Done';
}

export interface AppState {
  clients: Client[];
  suppliers: Supplier[];
  orders: Order[];
  products: Product[];
  team: TeamMember[];
  tasks: Task[];
}
