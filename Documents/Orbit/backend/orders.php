<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT orders.*, clients.name as clientName, clients.company as clientCompany 
                FROM orders 
                LEFT JOIN clients ON orders.client_id = clients.id 
                ORDER BY orders.date DESC";
        $stmt = $db->query($sql);
        $orders = $stmt->fetchAll();
        
        foreach ($orders as &$order) {
            if (!$order['clientName']) {
                $order['clientName'] = 'Unknown Client';
            }
            $order['clientId'] = (int)$order['client_id'];
            $order['id'] = (int)$order['id'];
            $order['amount'] = (float)$order['amount'];
            unset($order['client_id']);
        }
        jsonResponse($orders);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("INSERT INTO orders (client_id, amount, date, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['clientId'], 
            $data['amount'], 
            $data['date'], 
            $data['status']
        ]);
        
        $id = $db->lastInsertId();
        
        $stmt = $db->prepare("SELECT orders.*, clients.name as clientName FROM orders LEFT JOIN clients ON orders.client_id = clients.id WHERE orders.id = ?");
        $stmt->execute([$id]);
        $newOrder = $stmt->fetch();
        
        $newOrder['clientId'] = $newOrder['client_id'];
        unset($newOrder['client_id']);
        
        jsonResponse($newOrder, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (isset($data['status']) && count($data) == 2) {
             $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
             $stmt->execute([$data['status'], $data['id']]);
        } else {
             $stmt = $db->prepare("UPDATE orders SET client_id = ?, amount = ?, date = ?, status = ? WHERE id = ?");
             $stmt->execute([
                $data['clientId'], 
                $data['amount'], 
                $data['date'], 
                $data['status'], 
                $data['id']
            ]);
        }
        
        $stmt = $db->prepare("SELECT orders.*, clients.name as clientName FROM orders LEFT JOIN clients ON orders.client_id = clients.id WHERE orders.id = ?");
        $stmt->execute([$data['id']]);
        $updatedOrder = $stmt->fetch();
        $updatedOrder['clientId'] = $updatedOrder['client_id'];
        unset($updatedOrder['client_id']);

        jsonResponse($updatedOrder);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
}
?>
