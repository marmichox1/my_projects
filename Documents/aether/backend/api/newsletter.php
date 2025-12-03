<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../config/database.php';
include_once '../models/Newsletter.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit();
}

$newsletter = new Newsletter($db);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
  
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->email)) {
        $newsletter->email = $data->email;

        if ($newsletter->subscribe()) {
            http_response_code(201);
            echo json_encode(["message" => "Successfully subscribed to newsletter"]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to subscribe. Email may be invalid or already subscribed."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Email is required"]);
    }

} else if ($method === 'GET') {
    $stmt = $newsletter->read();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $subscribers_arr = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subscriber_item = [
                "id" => $row['id'],
                "email" => $row['email'],
                "subscribed_at" => $row['subscribed_at']
            ];
            array_push($subscribers_arr, $subscriber_item);
        }

        http_response_code(200);
        echo json_encode($subscribers_arr);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "No subscribers found"]);
    }

} else if ($method === 'DELETE') {
  
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->email)) {
        $newsletter->email = $data->email;

        if ($newsletter->unsubscribe()) {
            http_response_code(200);
            echo json_encode(["message" => "Successfully unsubscribed"]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to unsubscribe"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Email is required"]);
    }

} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
