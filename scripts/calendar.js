document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    // Obtém a data atual
    var now = new Date();
    // Define o primeiro dia do mês atual
    var firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Inicializa o calendário
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialDate: firstDayOfMonth.toISOString().split('T')[0], // Formata a data para 'YYYY-MM-DD'
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectMirror: true,
        select: function (arg) {
            document.getElementById('event-form').style.display = 'block';
            document.getElementById('startDate').value = arg.startStr; // Corrigido 'startDate'
            document.getElementById('endDate').value = arg.endStr || arg.startStr; // Corrigido 'endDate'
        },
        eventClick: function (arg) {
            console.log('Event clicked:', arg);

            // Certifique-se de que 'arg.event' existe
            const event = arg.event;
            if (!event) {
                console.error('Event object is missing in eventClick.');
                return;
            }

            // Adicione um log para verificar o conteúdo de `extendedProps`
            console.log('Event extendedProps:', event.extendedProps);

            // Verifica se o objeto `event` e suas propriedades existem
            const title = event.title || 'Não especificado';
            const start = event.start ? formatDate(event.start) : 'Não especificado';
            const end = event.end ? formatDate(event.end) : 'Não especificado';
            const type = event.extendedProps ? event.extendedProps.type || 'Não especificado' : 'Não especificado';
            const description = event.extendedProps ? event.extendedProps.description || 'Não especificado' : 'Não especificado';

            // Logs de depuração para verificar os valores
            console.log('Event Title:', title);
            console.log('Event Start:', start);
            console.log('Event End:', end);
            console.log('Event Type:', type);
            console.log('Event Description:', description);

            // Atualiza os campos do modal com as informações do evento
            document.getElementById('event-title-text').innerText = title;
            document.getElementById('event-start-text').innerText = start;
            document.getElementById('event-end-text').innerText = end;
            document.getElementById('event-type-text').innerText = type;
            document.getElementById('event-description-text').innerText = description;

            // Exibe a seção de detalhes do evento
            document.getElementById('event-details').style.display = 'block';
            document.getElementById('modal-overlay').style.display = 'block'; // Exibe o overlay

            // Define o callback para o botão de excluir
            document.getElementById('delete-event').onclick = function () {
                if (confirm('Tem certeza de que deseja excluir este evento?')) {
                    console.log('Deleting event:', arg.event.id);
                    fetch('http://econograma.infinityfreeapp.com/php/delete_events.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: arg.event.id })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Delete response:', data);
                            if (data.success) {
                                arg.event.remove();
                                closeModal('event-details');
                            } else {
                                alert('Falha ao excluir o evento');
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao excluir evento:', error);
                            alert('Ocorreu um erro ao tentar excluir o evento.');
                        });
                }
            };
        },
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: function (fetchInfo, successCallback, failureCallback) {
            fetch('http://econograma.infinityfreeapp.com/php/get_events.php')
                .then(response => response.json())
                .then(data => {
                    console.log('Response data:', data); // Loga a resposta completa para verificar o que foi recebido

                    if (data.success) {
                        const events = data.events.map(event => {
                            console.log('Processing event:', event); // Loga cada evento para ver os dados processados

                            let backgroundColor;
                            switch (event.type) {
                                case 'Papel':
                                    backgroundColor = '#f7e7b0'; // Cor para Papel
                                    break;
                                case 'Plástico':
                                    backgroundColor = '#f5b0e7'; // Cor para Plástico
                                    break;
                                case 'Vidro':
                                    backgroundColor = '#b0f5e7'; // Cor para Vidro
                                    break;
                                case 'Metal':
                                    backgroundColor = '#e7b0f5'; // Cor para Metal
                                    break;
                                case 'Orgânico':
                                    backgroundColor = '#b0f5b1'; // Cor para Orgânico
                                    break;
                                default:
                                    backgroundColor = '#b0b7b7'; // Cor padrão
                                    break;
                            }

                            // Concatenar data e hora para formar strings de início e fim
                            const start = `${event.startDate}T${event.startTime}`;
                            const end = event.endDate && event.endTime ? `${event.endDate}T${event.endTime}` : null;

                            return {
                                id: event.id,
                                title: event.title,
                                start: start, // Passa o valor concatenado de data e hora
                                end: end, // Passa o valor concatenado de data e hora ou null
                                backgroundColor: backgroundColor, // Define a cor do fundo do evento
                                extendedProps: {
                                    type: event.type || 'Não especificado',
                                    description: event.description || 'Não especificado'
                                }
                            };
                        });

                        successCallback(events);
                    } else {
                        console.error('Error from server:', data.message);
                        failureCallback(new Error(data.message));
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar eventos:', error);
                    failureCallback(error);
                });
        }
    });

    // Adiciona um evento ao formulário
    document.getElementById('form').addEventListener('submit', function (e) {
        e.preventDefault();

        var title = document.getElementById('title').value;

        // Pega os valores de data e hora separadamente
        var startDate = document.getElementById('startDate').value;
        var startTime = document.getElementById('startTime').value;
        var endDate = document.getElementById('endDate').value;
        var endTime = document.getElementById('endTime').value;

        var type = document.getElementById('type').value;
        var description = document.getElementById('description').value;

        // Valida se as datas são válidas
        if (!startDate || !endDate || !startTime || !endTime) {
            alert('Por favor, insira datas e horas válidas.');
            return;
        }

        // Faz a requisição para o servidor enviando data e hora separadamente
        fetch('http://econograma.infinityfreeapp.com/php/add_events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                type: type,
                description: description
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log da resposta para depuração
                if (data.success) {
                    calendar.addEvent({
                        title: title,
                        start: startDate + ' ' + startTime, // Usado para o calendário, mas mantendo separados no banco
                        end: endDate + ' ' + endTime,
                        extendedProps: {
                            type: type,
                            description: description
                        }
                    });
                    document.getElementById('form').reset();
                    closeModal('event-form');
                } else {
                    alert('Falha ao adicionar evento: ' + (data.message || 'Erro desconhecido'));
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar adicionar o evento.');
            });
    });

    function formatDate(dateStr) {
        console.log(`Original date string: ${dateStr}`);

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo'  // Ajuste o fuso horário conforme necessário
        };

        let formattedDate;
        try {
            formattedDate = new Date(dateStr).toLocaleString('pt-BR', options).replace(',', '');
        } catch (error) {
            console.error(`Erro ao formatar data: ${error}`);
            formattedDate = 'Data inválida';
        }

        console.log(`Formatted date string: ${formattedDate}`);
        return formattedDate;
    }

    // Renderiza o calendário
    calendar.render();
});
