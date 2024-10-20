document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado com sucesso.');

    document.getElementById('account-settings-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        console.log('Novo nome de usuário:', username);
        console.log('Novo e-mail:', email);

        if (!username && !email) {
            alert('Preencha pelo menos um campo para atualizar.');
            return;
        }

        const data = {};
        if (username) data.newUsername = username; // Nome do campo ajustado
        if (email) data.newEmail = email; // Nome do campo ajustado

        fetch('http://econograma.infinityfreeapp.com/php/update_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);
            if (data.success) {
                alert('Informações atualizadas com sucesso!');
            } else {
                alert('Erro ao atualizar informações: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });

    // Alterar Senha
    document.getElementById('password-change-form').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        // Depuração: Verifique os valores de senha antes de enviar
        console.log("Senha Atual:", currentPassword);
        console.log("Nova Senha:", newPassword);
        
        fetch('http://econograma.infinityfreeapp.com/php/change_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor:", data); // Depuração: Ver resposta do servidor
            if (data.success) {
                alert('Senha alterada com sucesso!');
            } else {
                alert('Erro ao alterar senha: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error); // Depuração: Exibir erros na requisição
        });
    });
});
