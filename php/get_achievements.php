<?php
session_start();
header('Content-Type: application/json');

// Configuração de CORS
header('Access-Control-Allow-Origin: http://localhost'); // Altere para o URL do seu frontend ou use '*' para permitir qualquer origem
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

    // Consulta para contar eventos por tipo para o usuário logado
    $sql = "SELECT type, COUNT(*) as count 
            FROM eventos 
            WHERE user_id = ?
            GROUP BY type";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $achievements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'achievements' => $achievements]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
