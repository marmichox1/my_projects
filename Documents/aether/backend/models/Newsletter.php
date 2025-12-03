<?php
/**
 * Newsletter Model
 * 
 * Handles newsletter subscription operations
 */

class Newsletter {
    private $conn;
    private $table_name = "newsletter_subscribers";

    public $id;
    public $email;
    public $subscribed_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Subscribe email to newsletter
     * 
     * @return bool
     */
    public function subscribe() {
      
        $check_query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 1";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(1, $this->email);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            return false; 
        }

       
        $query = "INSERT INTO " . $this->table_name . " (email) VALUES (:email)";
        $stmt = $this->conn->prepare($query);

       
        $this->email = filter_var($this->email, FILTER_SANITIZE_EMAIL);

        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $stmt->bindParam(":email", $this->email);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    /**
     * Get all subscribers
     * 
     * @return PDOStatement
     */
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY subscribed_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Unsubscribe email
     * 
     * @return bool
     */
    public function unsubscribe() {
        $query = "DELETE FROM " . $this->table_name . " WHERE email = ?";
        $stmt = $this->conn->prepare($query);

        $this->email = filter_var($this->email, FILTER_SANITIZE_EMAIL);
        $stmt->bindParam(1, $this->email);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
