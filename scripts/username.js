function getUsername() {
    fetch('http://econograma.infinityfreeapp.com/php/getUsername.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('usernameDisplay').textContent = data.username;
        } else {
            console.error('Erro ao obter o nome de usuário:', data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
}

// Chama a função quando a página carrega ou quando necessário
document.addEventListener('DOMContentLoaded', getUsername);
