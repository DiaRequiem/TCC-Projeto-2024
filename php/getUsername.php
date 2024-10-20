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

    // Verifique se o usuário está logado
    if (!isset($_SESSION['userId'])) {
        echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
        exit;
    }

    $user_id = $_SESSION['userId'];

    // Obtenha o nome de usuário do banco de dados
    $stmt = $pdo->prepare("SELECT nome FROM usuarios WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['success' => true, 'username' => $user['nome']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
