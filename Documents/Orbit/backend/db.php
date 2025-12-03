<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $pdo;

    public function __construct() {
        $dbFile = __DIR__ . '/database.sqlite';
        $init = !file_exists($dbFile);
        
        try {
            $this->pdo = new PDO("sqlite:$dbFile");
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            if ($init) {
                $this->initDatabase();
            }
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            exit();
        }
    }

    private function initDatabase() {
        $sql = file_get_contents(__DIR__ . '/schema.sql');
        $this->pdo->exec($sql);
    }

    public function getConnection() {
        return $this->pdo;
    }
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

$db = (new Database())->getConnection();
?>
