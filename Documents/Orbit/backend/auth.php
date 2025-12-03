<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $update = $db->prepare("UPDATE users SET last_active = 'Just now' WHERE id = ?");
        $update->execute([$user['id']]);

        jsonResponse([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
    } else {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }
}
?>
