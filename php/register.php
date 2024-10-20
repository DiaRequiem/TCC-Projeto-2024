<?php
header('Content-Type: application/json');

$host = 'sql202.infinityfree.com';
$db = 'if0_36826555_econograma';
$user = 'if0_36826555';
$pass = 'FNA16PTyMGp';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = $_POST['senha'];

// Codificando a senha com base64_encode antes de salvar no banco de dados
$senhaCripto = base64_encode($senha);

$stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
$stmt->execute([$nome, $email, $senhaCripto]);

echo json_encode(['status' => 'success']);
?>
