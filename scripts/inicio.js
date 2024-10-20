document.addEventListener("DOMContentLoaded", function() {
    console.log('Document loaded, starting fetch...');

    fetch('http://econograma.infinityfreeapp.com/php/get_events.php')
        .then(response => {
            console.log('Received response:', response);
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);

            const infoMessage = document.getElementById('info-message');
            const eventosContainer = document.querySelector('.eventos');
            const eventList = document.getElementById('event-list'); // Container para renderizar eventos

            // Limpar eventos anteriores
            eventList.innerHTML = '';

            if (data.success) {
                // Filtrar eventos do dia atual
                const today = new Date();
                const todayEvents = data.events.filter(evento => {
                    // Concatenar data e hora para formar a string de início
                    const eventDate = new Date(`${evento.startDate}T${evento.startTime}`);
                    return (
                        eventDate.getDate() === today.getDate() &&
                        eventDate.getMonth() === today.getMonth() &&
                        eventDate.getFullYear() === today.getFullYear()
                    );
                });

                if (todayEvents.length === 0) {
                    console.log('No events for today, updating message and container style.');

                    // Mudar texto e CSS quando não houver eventos
                    infoMessage.textContent = 'Sem eventos para hoje';
                    infoMessage.style.color = 'white';
                    infoMessage.style.textAlign = 'center';

                    // Modificar o CSS do container .eventos
                    eventosContainer.style.transition = '0.5s';
                    eventosContainer.style.borderRadius = '12px';
                    eventosContainer.style.height = '100px';
                    eventosContainer.style.backgroundColor = 'rgb(165, 165, 165)';
                    eventosContainer.style.overflow = 'hidden';
                    eventosContainer.style.cursor = 'default';
                    eventosContainer.style.pointerEvents = 'none';
                } else {
                    console.log(`Found ${todayEvents.length} events for today, updating message and rendering...`);

                    // Mudar texto e CSS quando houver eventos
                    infoMessage.textContent = `Você tem ${todayEvents.length} evento(s) hoje:`;

                    eventosContainer.style.transition = '0.5s';
                    eventosContainer.style.borderRadius = '12px';
                    eventosContainer.style.height = 'auto'; // Ajuste a altura conforme os eventos
                    eventosContainer.style.backgroundColor = 'rgb(245, 245, 245)';
                    eventosContainer.style.overflow = 'visible';
                    eventosContainer.style.cursor = 'pointer';
                    eventosContainer.style.pointerEvents = 'auto';

                    // Criar um card para cada evento
                    todayEvents.forEach(evento => {
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

                        // Adicionar o card na lista de eventos
                        eventList.appendChild(eventoDiv);
                    });

                    console.log('Events rendered successfully.');
                }
            } else {
                console.error('Erro: ', data.message);
            }
        })
        .catch(error => console.error('Erro na requisição:', error));
});
