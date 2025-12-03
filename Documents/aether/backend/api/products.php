<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../config/database.php';
include_once '../models/Product.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit();
}

$product = new Product($db);


$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
   
    if (isset($_GET['id'])) {
        $product->id = $_GET['id'];
        
        if ($product->readOne()) {
            $product_item = [
                "id" => $product->id,
                "name" => $product->name,
                "price" => floatval($product->price),
                "category" => $product->category,
                "image" => $product->image,
                "hoverImage" => $product->hover_image,
                "description" => $product->description,
                "isNew" => (bool)$product->is_new
            ];
            
            http_response_code(200);
            echo json_encode($product_item);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Product not found"]);
        }
    } 
   
    else if (isset($_GET['category'])) {
        $stmt = $product->readByCategory($_GET['category']);
        $num = $stmt->rowCount();

        if ($num > 0) {
            $products_arr = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $product_item = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => floatval($row['price']),
                    "category" => $row['category'],
                    "image" => $row['image'],
                    "hoverImage" => $row['hover_image'],
                    "description" => $row['description'],
                    "isNew" => (bool)$row['is_new']
                ];
                array_push($products_arr, $product_item);
            }

            http_response_code(200);
            echo json_encode($products_arr);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No products found"]);
        }
    }
   
    else {
        $stmt = $product->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $products_arr = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $product_item = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => floatval($row['price']),
                    "category" => $row['category'],
                    "image" => $row['image'],
                    "hoverImage" => $row['hover_image'],
                    "description" => $row['description'],
                    "isNew" => (bool)$row['is_new']
                ];
                array_push($products_arr, $product_item);
            }

            http_response_code(200);
            echo json_encode($products_arr);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No products found"]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
