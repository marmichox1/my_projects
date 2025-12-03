<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query("SELECT * FROM users ORDER BY id DESC");
        $users = $stmt->fetchAll();
        
        $team = array_map(function($user) {
            return [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'status' => $user['status'],
                'lastActive' => $user['last_active']
            ];
        }, $users);
        
        jsonResponse($team);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $password = password_hash('password', PASSWORD_DEFAULT);
        
        $stmt = $db->prepare("INSERT INTO users (name, email, password, role, status, last_active) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'], 
            $data['email'], 
            $password,
            $data['role'], 
            $data['status'],
            'Just now'
        ]);
        
        $id = $db->lastInsertId();
        $data['id'] = $id;
        $data['lastActive'] = 'Just now';
        jsonResponse($data, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $data['name'], 
            $data['email'], 
            $data['role'], 
            $data['status'], 
            $data['id']
        ]);
        
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$data['id']]);
        $user = $stmt->fetch();
        
        jsonResponse([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'status' => $user['status'],
            'lastActive' => $user['last_active']
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
}
?>
