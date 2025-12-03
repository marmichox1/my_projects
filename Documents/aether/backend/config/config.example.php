<?php
/**
 * Environment Configuration Template
 * 
 * Copy this file to config.php and update with your settings
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'aether_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// API Configuration
define('API_VERSION', '1.0.0');
define('API_BASE_URL', 'http://localhost/aether/backend/api');

// CORS Configuration
define('CORS_ORIGIN', '*'); // Change to specific domain in production
define('CORS_METHODS', 'GET, POST, PUT, DELETE, OPTIONS');
define('CORS_HEADERS', 'Content-Type, Authorization');

// Application Settings
define('APP_NAME', 'Aether E-commerce API');
define('APP_ENV', 'development'); // development, staging, production

// Error Reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

// Timezone
date_default_timezone_set('UTC');

// Security Settings
define('HASH_ALGORITHM', 'sha256');
define('SESSION_LIFETIME', 3600); // 1 hour

// Email Configuration (for future use)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-password');
define('SMTP_FROM', 'noreply@aether.com');
define('SMTP_FROM_NAME', 'Aether');

// Pagination
define('ITEMS_PER_PAGE', 20);

// File Upload (for future use)
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
