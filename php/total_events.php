<?php
session_start();
header('Content-Type: application/json');

// Configuração de CORS
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

    // Consulta para contar o total de eventos para o usuário logado
    $sql = "SELECT COUNT(*) as total_events 
            FROM eventos 
            WHERE user_id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $totalEvents = $stmt->fetch(PDO::FETCH_ASSOC)['total_events'];

    // Obtenha o nome do usuário
    $stmt = $pdo->prepare("SELECT nome FROM usuarios WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['success' => true, 'username' => $user['nome'], 'total_events' => $totalEvents]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
