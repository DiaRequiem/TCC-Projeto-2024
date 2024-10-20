document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;

        fetch('http://econograma.infinityfreeapp.com/php/login.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: login, senha: senha })
        })
        .then(response => {
            console.log('Status da resposta:', response.status); // Linha para depuração
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data); // Linha para depuração
            if (data.status === 'success') {
                window.location.href = 'http://econograma.infinityfreeapp.com/html/abc.html'; 
            } else {
                alert('Credenciais inválidas.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});
