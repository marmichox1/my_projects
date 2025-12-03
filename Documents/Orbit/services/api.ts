import { Client, Supplier, Product, Order, TeamMember, Task, User } from '../types';

const API_URL = 'http://localhost:8000';

async function request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Request failed: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    login: (credentials: { email: string; password: string }) =>
        request<User>('auth.php', 'POST', credentials),

    getClients: () => request<Client[]>('clients.php'),
    createClient: (client: Omit<Client, 'id'>) => request<Client>('clients.php', 'POST', client),
    updateClient: (client: Client) => request<Client>('clients.php', 'PUT', client),
    deleteClient: (id: string) => request<{ success: boolean }>(`clients.php?id=${id}`, 'DELETE'),

    getSuppliers: () => request<Supplier[]>('suppliers.php'),
    createSupplier: (supplier: Omit<Supplier, 'id'>) => request<Supplier>('suppliers.php', 'POST', supplier),
    updateSupplier: (supplier: Supplier) => request<Supplier>('suppliers.php', 'PUT', supplier),
    deleteSupplier: (id: string) => request<{ success: boolean }>(`suppliers.php?id=${id}`, 'DELETE'),

    getProducts: () => request<Product[]>('products.php'),
    createProduct: (product: Omit<Product, 'id'>) => request<Product>('products.php', 'POST', product),
    updateProduct: (product: Product) => request<Product>('products.php', 'PUT', product),
    deleteProduct: (id: string) => request<{ success: boolean }>(`products.php?id=${id}`, 'DELETE'),

    getOrders: () => request<Order[]>('orders.php'),
    createOrder: (order: Omit<Order, 'id' | 'clientName'>) => request<Order>('orders.php', 'POST', order),
    updateOrder: (order: Order) => request<Order>('orders.php', 'PUT', order),
    deleteOrder: (id: string) => request<{ success: boolean }>(`orders.php?id=${id}`, 'DELETE'),

    getTeam: () => request<TeamMember[]>('team.php'),
    createTeamMember: (member: Omit<TeamMember, 'id'>) => request<TeamMember>('team.php', 'POST', member),
    updateTeamMember: (member: TeamMember) => request<TeamMember>('team.php', 'PUT', member),
    deleteTeamMember: (id: string) => request<{ success: boolean }>(`team.php?id=${id}`, 'DELETE'),

    getTasks: () => request<Task[]>('tasks.php'),
    createTask: (task: Omit<Task, 'id'>) => request<Task>('tasks.php', 'POST', task),
    updateTask: (task: Task) => request<Task>('tasks.php', 'PUT', task),
    deleteTask: (id: string) => request<{ success: boolean }>(`tasks.php?id=${id}`, 'DELETE'),
};
