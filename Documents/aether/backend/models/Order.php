<?php


class Order {
    private $conn;
    private $table_name = "orders";
    private $items_table = "order_items";

    public $id;
    public $customer_email;
    public $customer_name;
    public $total_amount;
    public $status;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create new order with items
     * 
     * @param array $items
     * @return bool|int Returns order ID on success, false on failure
     */
    public function create($items) {
        try {
         
            $this->conn->beginTransaction();

           
            $query = "INSERT INTO " . $this->table_name . " 
                      (customer_email, customer_name, total_amount, status) 
                      VALUES (:email, :name, :total, :status)";

            $stmt = $this->conn->prepare($query);

            $this->customer_email = htmlspecialchars(strip_tags($this->customer_email));
            $this->customer_name = htmlspecialchars(strip_tags($this->customer_name));
            $this->status = 'pending';

            $stmt->bindParam(":email", $this->customer_email);
            $stmt->bindParam(":name", $this->customer_name);
            $stmt->bindParam(":total", $this->total_amount);
            $stmt->bindParam(":status", $this->status);

            $stmt->execute();
            $order_id = $this->conn->lastInsertId();

           
            $item_query = "INSERT INTO " . $this->items_table . " 
                          (order_id, product_id, product_name, price, quantity, size) 
                          VALUES (:order_id, :product_id, :product_name, :price, :quantity, :size)";

            $item_stmt = $this->conn->prepare($item_query);

            foreach ($items as $item) {
                $item_stmt->bindParam(":order_id", $order_id);
                $item_stmt->bindParam(":product_id", $item['id']);
                $item_stmt->bindParam(":product_name", $item['name']);
                $item_stmt->bindParam(":price", $item['price']);
                $item_stmt->bindParam(":quantity", $item['quantity']);
                $item_stmt->bindParam(":size", $item['selectedSize']);
                $item_stmt->execute();
            }

          
            $this->conn->commit();
            return $order_id;

        } catch (Exception $e) {
           
            $this->conn->rollBack();
            error_log("Order creation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get order by ID with items
     * 
     * @return array|false
     */
    public function readOne() {
        $query = "SELECT o.*, 
                         oi.id as item_id, 
                         oi.product_id, 
                         oi.product_name, 
                         oi.price as item_price, 
                         oi.quantity, 
                         oi.size
                  FROM " . $this->table_name . " o
                  LEFT JOIN " . $this->items_table . " oi ON o.id = oi.order_id
                  WHERE o.id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) > 0) {
            $order = [
                'id' => $rows[0]['id'],
                'customer_email' => $rows[0]['customer_email'],
                'customer_name' => $rows[0]['customer_name'],
                'total_amount' => $rows[0]['total_amount'],
                'status' => $rows[0]['status'],
                'created_at' => $rows[0]['created_at'],
                'items' => []
            ];

            foreach ($rows as $row) {
                if ($row['item_id']) {
                    $order['items'][] = [
                        'product_id' => $row['product_id'],
                        'product_name' => $row['product_name'],
                        'price' => $row['item_price'],
                        'quantity' => $row['quantity'],
                        'size' => $row['size']
                    ];
                }
            }

            return $order;
        }

        return false;
    }

    /**
     * Get all orders
     * 
     * @return PDOStatement
     */
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Update order status
     * 
     * @return bool
     */
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->status = htmlspecialchars(strip_tags($this->status));

        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
