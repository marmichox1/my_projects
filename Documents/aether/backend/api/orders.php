<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';
include_once '../models/Order.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit();
}

$order = new Order($db);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    
    $data = json_decode(file_get_contents("php://input"));

    if (
        !empty($data->customer_email) &&
        !empty($data->customer_name) &&
        !empty($data->items) &&
        is_array($data->items) &&
        count($data->items) > 0
    ) {
        $order->customer_email = $data->customer_email;
        $order->customer_name = $data->customer_name;
        
       
        $total = 0;
        foreach ($data->items as $item) {
            $total += $item->price * $item->quantity;
        }
        $order->total_amount = $total;

        $items = json_decode(json_encode($data->items), true);

        $order_id = $order->create($items);

        if ($order_id) {
            http_response_code(201);
            echo json_encode([
                "message" => "Order created successfully",
                "order_id" => $order_id
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create order"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to create order. Data is incomplete."]);
    }

} else if ($method === 'GET') {
  
    if (isset($_GET['id'])) {
        $order->id = $_GET['id'];
        $order_data = $order->readOne();

        if ($order_data) {
            http_response_code(200);
            echo json_encode($order_data);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Order not found"]);
        }
    } 
   
    else {
        $stmt = $order->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $orders_arr = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $order_item = [
                    "id" => $row['id'],
                    "customer_email" => $row['customer_email'],
                    "customer_name" => $row['customer_name'],
                    "total_amount" => floatval($row['total_amount']),
                    "status" => $row['status'],
                    "created_at" => $row['created_at']
                ];
                array_push($orders_arr, $order_item);
            }

            http_response_code(200);
            echo json_encode($orders_arr);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No orders found"]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
