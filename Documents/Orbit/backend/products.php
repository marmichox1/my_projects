<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll();
        foreach ($products as &$product) {
            $product['id'] = (int)$product['id'];
            $product['price'] = (float)$product['price'];
            $product['stock'] = (int)$product['stock'];
        }
        jsonResponse($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("INSERT INTO products (name, sku, price, stock, category, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'], 
            $data['sku'], 
            $data['price'], 
            $data['stock'], 
            $data['category'], 
            $data['status']
        ]);
        
        $data['id'] = $db->lastInsertId();
        jsonResponse($data, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("UPDATE products SET name = ?, sku = ?, price = ?, stock = ?, category = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $data['name'], 
            $data['sku'], 
            $data['price'], 
            $data['stock'], 
            $data['category'], 
            $data['status'], 
            $data['id']
        ]);
        
        jsonResponse($data);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
}
?>
