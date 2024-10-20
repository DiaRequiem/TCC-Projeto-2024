<?php
session_start();
header('Content-Type: application/json');

$host = 'sql202.infinityfree.com';
$db = 'if0_36826555_econograma';
$user = 'if0_36826555';
$pass = 'FNA16PTyMGp';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se o usuário está logado
    if (!isset($_SESSION['userId'])) {
        echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
        exit;
    }

    $user_id = $_SESSION['userId'];

// Obtenha os dados do corpo da solicitação
    $data = json_decode(file_get_contents('php://input'), true);

    $title = $data['title'];
    $startDate = $data['startDate']; // Data de início
    $startTime = $data['startTime']; // Hora de início
    $endDate = $data['endDate'] ?? null; // Data de fim (opcional)
    $endTime = $data['endTime'] ?? null; // Hora de fim (opcional)
    $type = $data['type'];
    $description = $data['description'];

    // Inserção do evento no banco de dados com os campos de data e hora separados
    $stmt = $pdo->prepare("
        INSERT INTO eventos (user_id, title, startDate, startTime, endDate, endTime, type, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$user_id, $title, $startDate, $startTime, $endDate, $endTime, $type, $description]);

    // Atualizar a contagem de eventos para o usuário
    $stmt = $pdo->prepare("UPDATE usuarios SET num_eventos = num_eventos + 1 WHERE id = ?");
    $stmt->execute([$user_id]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
