<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT tasks.*, users.name as assignee_name 
                FROM tasks 
                LEFT JOIN users ON tasks.assignee_id = users.id 
                ORDER BY tasks.due_date ASC";
        $stmt = $db->query($sql);
        $tasks = $stmt->fetchAll();
        
        $formattedTasks = array_map(function($task) {
            return [
                'id' => $task['id'],
                'title' => $task['title'],
                'description' => $task['description'],
                'assignee' => $task['assignee_name'] ?? 'Unassigned',
                'priority' => $task['priority'],
                'tags' => $task['tags'] ? explode(',', $task['tags']) : [],
                'status' => $task['status'],
                'dueDate' => $task['due_date']
            ];
        }, $tasks);
        
        jsonResponse($formattedTasks);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $assigneeId = null;
        if (isset($data['assignee'])) {
            $stmt = $db->prepare("SELECT id FROM users WHERE name = ?");
            $stmt->execute([$data['assignee']]);
            $user = $stmt->fetch();
            if ($user) $assigneeId = $user['id'];
        }

        $tags = isset($data['tags']) && is_array($data['tags']) ? implode(',', $data['tags']) : '';

        $stmt = $db->prepare("INSERT INTO tasks (title, description, assignee_id, priority, tags, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'], 
            $data['description'], 
            $assigneeId, 
            $data['priority'], 
            $tags, 
            $data['status'], 
            $data['dueDate']
        ]);
        
        $id = $db->lastInsertId();
        $data['id'] = $id;
        jsonResponse($data, 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $assigneeId = null;
        if (isset($data['assignee'])) {
            $stmt = $db->prepare("SELECT id FROM users WHERE name = ?");
            $stmt->execute([$data['assignee']]);
            $user = $stmt->fetch();
            if ($user) $assigneeId = $user['id'];
        }

        $tags = isset($data['tags']) && is_array($data['tags']) ? implode(',', $data['tags']) : '';

        $stmt = $db->prepare("UPDATE tasks SET title = ?, description = ?, assignee_id = ?, priority = ?, tags = ?, status = ?, due_date = ? WHERE id = ?");
        $stmt->execute([
            $data['title'], 
            $data['description'], 
            $assigneeId, 
            $data['priority'], 
            $tags, 
            $data['status'], 
            $data['dueDate'],
            $data['id']
        ]);
        
        jsonResponse($data);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
}
?>
