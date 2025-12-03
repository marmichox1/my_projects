<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$api_info = [
    "name" => "Aether E-commerce API",
    "version" => "1.0.0",
    "description" => "RESTful API for Aether Modern Apparel e-commerce platform",
    "endpoints" => [
        [
            "path" => "/api/products.php",
            "methods" => ["GET"],
            "description" => "Get all products, single product by ID, or filter by category",
            "parameters" => [
                "id" => "Product ID (optional)",
                "category" => "Product category (optional)"
            ]
        ],
        [
            "path" => "/api/orders.php",
            "methods" => ["GET", "POST"],
            "description" => "Create new order or get orders",
            "parameters" => [
                "id" => "Order ID for GET requests (optional)"
            ],
            "body" => [
                "customer_email" => "Customer email address",
                "customer_name" => "Customer name",
                "items" => "Array of cart items with id, name, price, quantity, selectedSize"
            ]
        ],
        [
            "path" => "/api/newsletter.php",
            "methods" => ["GET", "POST", "DELETE"],
            "description" => "Manage newsletter subscriptions",
            "body" => [
                "email" => "Email address"
            ]
        ]
    ],
    "base_url" => "http://localhost/aether/backend",
    "documentation" => "See README.md for detailed API documentation"
];

http_response_code(200);
echo json_encode($api_info, JSON_PRETTY_PRINT);
