-- Users / Team Members
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- For auth
    role TEXT DEFAULT 'Viewer', -- Admin, Manager, Viewer
    status TEXT DEFAULT 'Active', -- Active, Inactive
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    status TEXT DEFAULT 'Active',
    revenue REAL DEFAULT 0
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    category TEXT,
    status TEXT DEFAULT 'Active'
);

-- Products / Inventory
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price REAL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    category TEXT,
    status TEXT -- In Stock, Low Stock, Out of Stock
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    amount REAL DEFAULT 0,
    date DATE,
    status TEXT, -- Pending, Processing, Completed, Cancelled
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id INTEGER, -- Links to users
    priority TEXT, -- High, Medium, Low
    tags TEXT, -- JSON or comma-separated
    status TEXT, -- Todo, In Progress, Done
    due_date DATE,
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- Seed Data
INSERT OR IGNORE INTO users (name, email, password, role, status, last_active) VALUES 
('Sarah Connor', 'sarah@orbit.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Active', 'Just now'), -- password: password
('John Doe', 'john@orbit.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 'Active', '2 hours ago'),
('Jane Smith', 'jane@orbit.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Viewer', 'Inactive', '3 days ago');

INSERT OR IGNORE INTO clients (name, company, email, status, revenue) VALUES
('Acme Corp', 'Acme Inc.', 'contact@acme.com', 'Active', 12500),
('Stark Ind', 'Stark Industries', 'tony@stark.com', 'Active', 45000),
('Wayne Ent', 'Wayne Enterprises', 'bruce@wayne.com', 'Inactive', 8200),
('Cyberdyne', 'Cyberdyne Sys', 'sales@cyberdyne.com', 'Active', 15600);

INSERT OR IGNORE INTO suppliers (name, contact, category, status) VALUES
('Global Tech', 'Alice Smith', 'Electronics', 'Active'),
('Office Depot', 'Bob Jones', 'Stationery', 'Active'),
('Cloud Serve', 'Charlie Day', 'Hosting', 'Paused');

INSERT OR IGNORE INTO products (name, sku, price, stock, category, status) VALUES
('Ergonomic Chair', 'FUR-001', 250.00, 45, 'Furniture', 'In Stock'),
('Wireless Mouse', 'TEC-023', 49.99, 8, 'Electronics', 'Low Stock'),
('Mechanical Keyboard', 'TEC-044', 120.00, 0, 'Electronics', 'Out of Stock'),
('Monitor Stand', 'ACC-112', 35.50, 120, 'Accessories', 'In Stock');

INSERT OR IGNORE INTO orders (client_id, amount, date, status) VALUES
(1, 1200, '2023-10-01', 'Completed'),
(2, 8500, '2023-10-03', 'Processing'),
(1, 320, '2023-10-05', 'Completed'),
(4, 5600, '2023-10-06', 'Pending'),
(3, 120, '2023-10-08', 'Cancelled'),
(2, 12400, '2023-10-09', 'Completed');

INSERT OR IGNORE INTO tasks (title, description, assignee_id, priority, tags, status, due_date) VALUES
('Q4 Financial Report', 'Compile and analyze Q4 revenue streams.', 1, 'High', 'Finance,Urgent', 'In Progress', '2023-11-15'),
('Update Website Homepage', 'Refresh banner images and copy.', 2, 'Medium', 'Design,Marketing', 'Todo', '2023-11-20'),
('Client Meeting Preparation', 'Prepare slides for Stark Ind review.', 1, 'High', 'Sales,Client', 'Done', '2023-10-25'),
('Inventory Audit', 'Check physical stock against system records.', 3, 'Low', 'Operations', 'Todo', '2023-11-30');
