<?php
header('Content-Type: application/json');

$host = 'localhost'; // Endereço do servidor do banco de dados
$db = 'econograma'; // Nome do banco de dados
$user = 'root'; // Usuário do banco de dados
$pass = ''; // Senha do banco de dados

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Exemplo de consulta
$stmt = $pdo->query("SELECT * FROM tabela");
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);
?>