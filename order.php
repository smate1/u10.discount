<?php
$data = json_decode(file_get_contents('php://input'), true);

$token = "7778812492:AAHYUPIK9mvPmaWwxnScL9IrrrnUlaUYJXQ";
$chat_id = "-4962267225";

$message = "
🛒 НОВЕ ЗАМОВЛЕННЯ

📦 Товар: {$data['productName']}
🎨 Колір: {$data['selectedColor']}
💰 Ціна: {$data['price']}
📞 Телефон: {$data['fullPhone']}
📵 Не дзвонити: " . ($data['noCall'] ? "✅" : "❌");

$apiUrl = "https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text=" . urlencode($message);

// Надсилаємо запит у Telegram
file_get_contents($apiUrl);

// Відповідь браузеру
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>