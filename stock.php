<?php
header('Content-Type: application/json');

$stockFile = 'stock.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($stockFile)) {
        echo file_get_contents($stockFile);
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $color = $input['color'] ?? null;

    if (!$color) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing color']);
        exit;
    }

    $stock = json_decode(file_get_contents($stockFile), true);

    if (!isset($stock[$color])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid color']);
        exit;
    }

    if ($stock[$color]['available'] > 0) {
        $stock[$color]['available'] -= 1;
        file_put_contents($stockFile, json_encode($stock, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'available' => $stock[$color]['available']]);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Out of stock']);
        exit;
    }
}
