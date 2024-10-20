<?php
session_start();
header('Content-Type: application/json');

// Verifica se o ID do usuário está armazenado na sessão
if (isset($_SESSION['userId'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Usuário logado',
        'userId' => $_SESSION['userId']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Nenhum usuário logado'
    ]);
}
?>