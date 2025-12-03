<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM clients ORDER BY id DESC");
        $clients = $stmt->fetchAll();
        jsonResponse($clients);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            jsonResponse(['error' => 'Name is required'], 400);
        }
        
        $stmt = $db->prepare("INSERT INTO clients (name, company, email, status, revenue) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'], 
            $data['company'] ?? '', 
            $data['email'] ?? '', 
            $data['status'] ?? 'Active', 
            $data['revenue'] ?? 0
        ]);
        
        $id = $db->lastInsertId();
        $data['id'] = $id;
        jsonResponse($data, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['id'])) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("UPDATE clients SET name = ?, company = ?, email = ?, status = ?, revenue = ? WHERE id = ?");
        $stmt->execute([
            $data['name'], 
            $data['company'], 
            $data['email'], 
            $data['status'], 
            $data['revenue'], 
            $data['id']
        ]);
        
        jsonResponse($data);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID is required'], 400);
        }

        $stmt = $db->prepare("DELETE FROM clients WHERE id = ?");
        $stmt->execute([$id]);
        
        jsonResponse(['success' => true]);
        break;
}
?>
