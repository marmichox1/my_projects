/**
 * API Service
 * 
 * Service layer for communicating with the PHP backend API
 */

const API_BASE_URL = 'http://localhost/aether/backend/api';

export interface ApiProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    hoverImage: string;
    description: string;
    isNew?: boolean;
}

export interface ApiOrder {
    customer_email: string;
    customer_name: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        selectedSize: string;
    }>;
}

export interface ApiOrderResponse {
    message: string;
    order_id: number;
}

export interface ApiNewsletterSubscription {
    email: string;
}

/**
 * Products API
 */
export const ProductsAPI = {
    /**
     * Get all products
     */
    async getAll(): Promise<ApiProduct[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products.php`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Get single product by ID
     */
    async getById(id: string): Promise<ApiProduct> {
        try {
            const response = await fetch(`${API_BASE_URL}/products.php?id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Get products by category
     */
    async getByCategory(category: string): Promise<ApiProduct[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products.php?category=${category}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products by category');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }
};

/**
 * Orders API
 */
export const OrdersAPI = {
    /**
     * Create a new order
     */
    async create(orderData: ApiOrder): Promise<ApiOrderResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/orders.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    /**
     * Get order by ID
     */
    async getById(id: number): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/orders.php?id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    /**
     * Get all orders
     */
    async getAll(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/orders.php`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }
};

/**
 * Newsletter API
 */
export const NewsletterAPI = {
    /**
     * Subscribe to newsletter
     */
    async subscribe(email: string): Promise<{ message: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/newsletter.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }

            return data;
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            throw error;
        }
    },

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(email: string): Promise<{ message: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/newsletter.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to unsubscribe');
            }

            return data;
        } catch (error) {
            console.error('Error unsubscribing from newsletter:', error);
            throw error;
        }
    },

    /**
     * Get all subscribers (admin only)
     */
    async getAll(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/newsletter.php`);
            if (!response.ok) {
                throw new Error('Failed to fetch subscribers');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            throw error;
        }
    }
};
