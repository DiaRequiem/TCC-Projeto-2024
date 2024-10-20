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

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['login']) || !isset($input['senha'])) {
        echo json_encode(['status' => 'error', 'message' => 'Dados de login incompletos.']);
        exit;
    }

    $login = $input['login'];
    $senha = base64_encode($input['senha']); // Codificando a senha com base64_encode

    $stmt = $pdo->prepare("SELECT id, senha FROM usuarios WHERE email = ? OR nome = ?");
    $stmt->execute([$login, $login]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && $senha === $usuario['senha']) { // Comparando a senha codificada
        $_SESSION['userId'] = $usuario['id'];
        echo json_encode(['status' => 'success', 'id' => $usuario['id']]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Credenciais inválidas.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
