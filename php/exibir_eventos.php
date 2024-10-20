<?php
session_start();
$host = 'sql202.infinityfree.com';
$db = 'if0_36826555_econograma';
$user = 'if0_36826555';
$pass = 'FNA16PTyMGp';

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar se o usuário está logado
    if (!isset($_SESSION['userId'])) {
        echo "<p>Você precisa estar logado para ver seus eventos.</p>";
        exit;
    }

    $user_id = $_SESSION['userId'];

    // Consulta SQL para pegar os 3 próximos eventos do usuário logado
    $sql = "SELECT nome_evento, descricao, data_evento 
            FROM eventos 
            WHERE user_id = ? 
            ORDER BY data_evento ASC 
            LIMIT 3";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id]);
    $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Verificar se há eventos
    if (count($eventos) > 0) {
        foreach ($eventos as $evento) {
            echo "<div class='evento'>";
            echo "<h2>{$evento['nome_evento']}</h2>";
            echo "<p>{$evento['descricao']}</p>";
            echo "<small>Data: {$evento['data_evento']}</small>";
            echo "</div>";
        }
    } else {
        echo "<p>Nenhum evento futuro encontrado.</p>";
    }
} catch (PDOException $e) {
    echo "<p>Erro ao buscar eventos: " . $e->getMessage() . "</p>";
}
?>
