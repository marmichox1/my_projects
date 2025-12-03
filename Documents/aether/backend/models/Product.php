<?php
/**
 * Product Model
 * 
 * Handles all product-related database operations
 */

class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $price;
    public $category;
    public $image;
    public $hover_image;
    public $description;
    public $is_new;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all products
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
     * Get single product by ID
     * 
     * @return bool
     */
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->price = $row['price'];
            $this->category = $row['category'];
            $this->image = $row['image'];
            $this->hover_image = $row['hover_image'];
            $this->description = $row['description'];
            $this->is_new = $row['is_new'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    /**
     * Get products by category
     * 
     * @param string $category
     * @return PDOStatement
     */
    public function readByCategory($category) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE category = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $category);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Create new product
     * 
     * @return bool
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, price, category, image, hover_image, description, is_new) 
                  VALUES (:name, :price, :category, :image, :hover_image, :description, :is_new)";

        $stmt = $this->conn->prepare($query);

      
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));

        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":hover_image", $this->hover_image);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":is_new", $this->is_new);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    /**
     * Update product
     * 
     * @return bool
     */
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET name = :name, 
                      price = :price, 
                      category = :category, 
                      image = :image, 
                      hover_image = :hover_image, 
                      description = :description, 
                      is_new = :is_new 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":hover_image", $this->hover_image);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":is_new", $this->is_new);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    /**
     * Delete product
     * 
     * @return bool
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
