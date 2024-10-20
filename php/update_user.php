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

    // Obtenha os dados do corpo da solicitação
    $data = json_decode(file_get_contents('php://input'), true);
    $newUsername = isset($data['newUsername']) ? $data['newUsername'] : null;
    $newEmail = isset($data['newEmail']) ? $data['newEmail'] : null;

    // Verifique se algum campo foi preenchido
    if (!$newUsername && !$newEmail) {
        echo json_encode(['success' => false, 'message' => 'Nenhum dado para atualizar']);
        exit;
    }

    // Construa a consulta SQL dinamicamente com base nos campos fornecidos
    $sql = "UPDATE usuarios SET ";
    $params = [];

    if ($newUsername) {
        $sql .= "nome = ?, ";
        $params[] = $newUsername;
    }

    if ($newEmail) {
        $sql .= "email = ?, ";
        $params[] = $newEmail;
    }

    // Remover a última vírgula e espaço
    $sql = rtrim($sql, ', ');

    // Adicionar a condição WHERE
    $sql .= " WHERE id = ?";
    $params[] = $user_id;

    // Prepare e execute a consulta
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Informações atualizadas com sucesso.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
