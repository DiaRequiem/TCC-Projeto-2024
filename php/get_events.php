<?php
session_start();
header('Content-Type: application/json');

// Configuração de CORS
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Código do PHP para processar a requisição
$host = 'sql202.infinityfree.com';
$db = 'if0_36826555_econograma';
$user = 'if0_36826555';
$pass = 'FNA16PTyMGp';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifique se o usuário está logado
    if (!isset($_SESSION['userId'])) {
        echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
        exit;
    }

    $user_id = $_SESSION['userId'];

     $user_id = $_SESSION['userId'];

    // Consulta para buscar os eventos do usuário
    $stmt = $pdo->prepare("SELECT id, title, startDate, startTime, endDate, endTime, type, description FROM eventos WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Adiciona depuração
    error_log("Eventos recuperados: " . print_r($events, true));

    echo json_encode(['success' => true, 'events' => $events]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
