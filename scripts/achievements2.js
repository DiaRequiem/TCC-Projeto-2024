function getUserInfo() {
    fetch('http://econograma.infinityfreeapp.com/php/total_events.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Exibir o nome de usuário
            document.getElementById('usernameDisplay').textContent = data.username;

            // Exibir a imagem com base no total de eventos
            const totalEvents = data.total_events;
            const medalImg = document.getElementById('medalDisplay');
            
            if (totalEvents >= 500) {
                medalImg.src = 'http://econograma.infinityfreeapp.com/imagens/medalha-ouro.png';
            } else if (totalEvents >= 300) {
                medalImg.src = 'http://econograma.infinityfreeapp.com/imagens/medalha-prata.png';
            } else if (totalEvents >= 100) {
                medalImg.src = 'http://econograma.infinityfreeapp.com/imagens/medalha-bronze.png';
            } else {
                medalImg.src = 'http://econograma.infinityfreeapp.com/imagens/medalha-inicial.png'; // Medalha padrão
            }
        } else {
            console.error('Erro ao obter informações do usuário:', data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
}

// Chama a função quando a página carrega ou quando necessário
document.addEventListener('DOMContentLoaded', getUserInfo);
