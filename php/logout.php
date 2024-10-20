<?php
session_start();
session_unset(); // Remove todas as variáveis de sessão
session_destroy(); // Destroi a sessão

// Redireciona para a página de login ou outra página após o logout
header('Location: http://econograma.infinityfreeapp.com/html/login.html'); // Altere para o caminho correto
exit;
?>
