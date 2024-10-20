document.addEventListener('DOMContentLoaded', function () {
    console.log("Página carregada. Iniciando busca por conquistas...");

    fetch('http://econograma.infinityfreeapp.com/php/get_achievements.php')
        .then(response => {
            console.log("Resposta recebida do servidor:", response);
            return response.json();
        })
        .then(data => {
            console.log("Dados JSON recebidos:", data);
            const achievementsContainer = document.getElementById('achievements');

            if (data.success) {
                console.log("Busca por conquistas bem-sucedida. Processando dados...");
                const eventTypes = ['Papel', 'Plástico', 'Vidro', 'Metal', 'Orgânico'];

                eventTypes.forEach(type => {
                    const achievement = data.achievements.find(a => a.type === type);
                    const count = achievement ? achievement.count : 0;

                    // Criar container para cada tipo de evento
                    const container = document.createElement('div');
                    container.classList.add('achievement-container');

                    // Título
                    const title = document.createElement('h3');
                    title.textContent = `${type}`;
                    container.appendChild(title);

                    // Contagem de eventos completados
                    const countElement = document.createElement('p');
                    countElement.textContent = `${count}/100 Reciclagens`;
                    container.appendChild(countElement);

                    // Medals: Definir a imagem da medalha com base no progresso
                    const medalImg = document.createElement('img');
                    medalImg.src = getMedalImage(count);  // Função que define a medalha com base no progresso
                    container.appendChild(medalImg);

                    // Barra de progresso
                    const progressBar = document.createElement('div');
                    progressBar.classList.add('progress-bar');

                    const progressFill = document.createElement('div');
                    progressFill.classList.add('progress-bar-fill');
                    progressFill.style.width = `${Math.min(count, 100)}%`;  // Limita o progresso a 100%
                    progressBar.appendChild(progressFill);

                    container.appendChild(progressBar);
                    achievementsContainer.appendChild(container);

                    console.log(`Conquista para ${type}: ${count} eventos completados.`);
                });
            } else {
                console.error("Erro ao carregar conquistas:", data.message);
                achievementsContainer.textContent = 'Erro ao carregar conquistas.';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar conquistas:', error);
            document.getElementById('achievements').textContent = 'Erro ao carregar conquistas.';
        });
});

// Função para definir a imagem da medalha com base na contagem de eventos e no tipo
function getMedalImage(count, type) {
    let medalPath = 'http://econograma.infinityfreeapp.com/imagens/'; // Caminho da pasta de imagens
  
    if (type === 'Papel') {
        medalPath += 'medalha_papel_'; // Medalhas específicas para Papel
    } else if (type === 'Plástico') {
        medalPath += 'medalha_plastico_'; // Medalhas específicas para Plástico
    } else if (type === 'Vidro') {
        medalPath += 'medalha_vidro_'; // Medalhas específicas para Vidro
    } else if (type === 'Metal') {
        medalPath += 'medalha_metal_'; // Medalhas específicas para Metal
    } else if (type === 'Orgânico') {
        medalPath += 'medalha_organico_'; // Medalhas específicas para Orgânico
    }
  
    // Define qual medalha será mostrada com base no número de eventos completados
    if (count >= 100) {
        return medalPath + 'medalha-ouro.png';
    } else if (count >= 60) {
        return medalPath + 'medalha-prata.png';
    } else if (count >= 25) {
        return medalPath + 'medalha-bronze.png';
    } else {
        return medalPath + 'medalha-inicial.png';
    }
  }