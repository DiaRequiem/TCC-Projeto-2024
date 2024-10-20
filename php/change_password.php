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
    $currentPassword = base64_encode($data['currentPassword']); // Codifique a senha atual
    $newPassword = base64_encode($data['newPassword']); // Codifique a nova senha

    // Verifique a senha atual
    $stmt = $pdo->prepare("SELECT senha FROM usuarios WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $currentPassword === $user['senha']) { // Comparando a senha codificada
        // Atualizar a senha com base64_encode
        $stmt = $pdo->prepare("UPDATE usuarios SET senha = ? WHERE id = ?");
        $stmt->execute([$newPassword, $user_id]);

        echo json_encode(['success' => true, 'message' => 'Senha atualizada com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
