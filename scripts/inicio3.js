document.addEventListener("DOMContentLoaded", function() {
    console.log('Document loaded, starting fetch for upcoming events...');

    fetch('http://econograma.infinityfreeapp.com/php/get_events.php')
        .then(response => {
            console.log('Received response for upcoming events:', response);
            return response.json();
        })
        .then(data => {
            console.log('JSON data for upcoming events:', data);

            const eventHistoryContainer = document.getElementById('event-history');

            // Limpar eventos anteriores
            eventHistoryContainer.innerHTML = '';

            if (data.success) {
                const today = new Date(); // Data de hoje

                // Filtrar eventos que NÃO são do dia de hoje
                const upcomingEvents = data.events.filter(evento => {
                    // Concatenar data e hora para formar a string de início
                    const eventDate = new Date(`${evento.startDate}T${evento.startTime}`);
                    return eventDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0); // Comparar só datas, sem horas
                });

                if (upcomingEvents.length === 0) {
                    console.log('No upcoming events found.');

                    // Exibir mensagem caso não haja eventos futuros
                    const noEventsMessage = document.createElement('p');
                    noEventsMessage.textContent = 'Sem eventos futuros.';
                    noEventsMessage.style.textAlign = 'center';
                    eventHistoryContainer.appendChild(noEventsMessage);
                } else {
                    console.log(`Found ${upcomingEvents.length} upcoming events, rendering...`);

                    // Criar um card para cada evento futuro
                    upcomingEvents.forEach(evento => {
                        const eventoDiv = document.createElement('div');
                        eventoDiv.classList.add('evento-card');

                        const titleP = document.createElement('h2');
                        titleP.textContent = evento.title;
                        titleP.classList.add('evento-title');
                        eventoDiv.appendChild(titleP);

                        const startP = document.createElement('p');
                        startP.innerHTML = `<strong>Data de Início:</strong> ${new Date(`${evento.startDate}T${evento.startTime}`).toLocaleDateString()}`;
                        eventoDiv.appendChild(startP);

                        const descriptionP = document.createElement('p');
                        descriptionP.innerHTML = `<strong>Descrição:</strong> ${evento.description || 'Sem descrição'}`;
                        eventoDiv.appendChild(descriptionP);

                        // Adicionar o card ao container de eventos futuros
                        eventHistoryContainer.appendChild(eventoDiv);
                    });

                    console.log('Upcoming events rendered successfully.');
                }
            } else {
                console.error('Erro: ', data.message);
            }
        })
        .catch(error => console.error('Erro na requisição:', error));
});