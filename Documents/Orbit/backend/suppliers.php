<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM suppliers ORDER BY id DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("INSERT INTO suppliers (name, contact, category, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['name'], 
            $data['contact'] ?? '', 
            $data['category'] ?? '', 
            $data['status'] ?? 'Active'
        ]);
        
        $data['id'] = $db->lastInsertId();
        jsonResponse($data, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("UPDATE suppliers SET name = ?, contact = ?, category = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $data['name'], 
            $data['contact'], 
            $data['category'], 
            $data['status'], 
            $data['id']
        ]);
        
        jsonResponse($data);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $stmt = $db->prepare("DELETE FROM suppliers WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
}
?>
