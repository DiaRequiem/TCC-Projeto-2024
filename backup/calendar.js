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
            document.getElementById('start').value = arg.startStr;
            document.getElementById('end').value = arg.endStr || arg.startStr;
        },
        eventClick: function (arg) {
            // Preenche o formulário com as informações do evento
            document.getElementById('event-title').value = arg.event.title;
            document.getElementById('event-start').value = arg.event.startStr;
            document.getElementById('event-end').value = arg.event.endStr || arg.event.startStr;
            document.getElementById('event-type').value = arg.event.extendedProps.type || 'Meeting';
            document.getElementById('event-location').value = arg.event.extendedProps.location || 'Office';
            document.getElementById('event-description').value = arg.event.extendedProps.description || '';
            document.getElementById('event-id').value = arg.event.id;

            // Exibe o formulário de detalhes do evento
            document.getElementById('event-details-form').style.display = 'block';

            // Define o callback para o botão de excluir
            document.getElementById('delete-event').onclick = function () {
                if (confirm('Tem certeza de que deseja excluir este evento?')) {
                    fetch('http://localhost/econograma/php/delete_events.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: arg.event.id })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            arg.event.remove();
                            document.getElementById('event-details-form').style.display = 'none';
                        } else {
                            alert('Falha ao excluir o evento');
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        alert('Ocorreu um erro ao tentar excluir o evento.');
                    });
                }
            };
        },
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('http://localhost/econograma/php/get_events.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        successCallback(data.events.map(event => ({
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end
                        })));
                    } else {
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
    if (validateForm()) {
        var title = document.getElementById('title').value;
        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value || start;
        var type = document.getElementById('type').value;
        var location = document.getElementById('location').value;
        var description = document.getElementById('description').value;

        fetch('http://localhost/econograma/php/add_events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                start: start,
                end: end,
                type: type,
                location: location,
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
                    start: start,
                    end: end,
                    extendedProps: {
                        type: type,
                        location: location,
                        description: description
                    }
                });
                document.getElementById('form').reset();
                document.getElementById('event-form').style.display = 'none';
            } else {
                alert('Falha ao adicionar evento: ' + (data.message || 'Erro desconhecido'));
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao tentar adicionar o evento.');
        });
    }
});

    // Renderiza o calendário
    calendar.render();
});
