<?php
$data = json_decode(file_get_contents('php://input'), true);

$token = "ТУТ_ТВОЙ_ТОКЕН";
$chat_id = "-4962267225";

$message = "
🛒 НОВЕ ЗАМОВЛЕННЯ

📦 Товар: {$data['productName']}
🎨 Колір: {$data['selectedColor']}
💰 Ціна: {$data['price']}
📞 Телефон: {$data['fullPhone']}
📵 Не дзвонити: " . ($data['noCall'] ? "✅" : "❌") . "
";

file_get_contents("https://api.telegram.org/bot$7778812492:AAHYUPIK9mvPmaWwxnScL9IrrrnUlaUYJXQ/sendMessage?chat_id=$-4962267225&text=" . urlencode($message));
echo json_encode(['success' => true]);
?>
