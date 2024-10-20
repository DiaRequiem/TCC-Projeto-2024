document.addEventListener('DOMContentLoaded', function () {
  // Adiciona o event listener para o overlay
  const overlay = document.getElementById('modal-overlay');

  // Verifica se o overlay foi encontrado antes de adicionar o event listener
  if (overlay) {
    overlay.addEventListener('click', closeModalOnOverlayClick);
  } else {
    console.error('Elemento com ID "modal-overlay" não encontrado.');
  }

  const modals = document.querySelectorAll('.modal');

  function updateOverlay() {
    const anyModalVisible = Array.from(modals).some(modal => modal.style.display === 'block');
    overlay.style.display = anyModalVisible ? 'block' : 'none';
  }

  // Função para observar mudanças no estilo dos modais
  function observeModals() {
    modals.forEach(modal => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.attributeName === 'style') {
            updateOverlay();
          }
        }
      });

      observer.observe(modal, { attributes: true });
    });
  }

  observeModals();

});

// Função para fechar um modal e esconder o overlay
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
};

// Função para fechar o modal quando o overlay é clicado
function closeModalOnOverlayClick(event) {
  // Verifica se o clique foi no overlay (e não em outro elemento dentro dele)
  if (event.target.id === 'modal-overlay') {
    closeModal('event-details'); // Altere para o ID do seu modal
    closeModal('event-form');    // Altere para o ID do seu modal
    event.target.style.display = 'none'; // Oculta o overlay
  }
};

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  const header = element.querySelector(".modal-header");

  if (header) {
      header.onmousedown = dragMouseDown;
  } else {
      element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      // Pega a posição do mouse ao começar o drag
      pos3 = e.pageX;
      pos4 = e.pageY;

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      // Calcula a nova posição do cursor
      pos1 = pos3 - e.pageX;
      pos2 = pos4 - e.pageY;
      pos3 = e.pageX;
      pos4 = e.pageY;

      // Calcula a nova posição do modal
      let newLeft = element.offsetLeft - pos1;
      let newTop = element.offsetTop - pos2;

      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const margin = -350;

      // Ajusta para manter uma margem mínima em relação à borda da tela
      if (newLeft < margin) newLeft = margin;
      if (newLeft + elementWidth > windowWidth - margin) newLeft = windowWidth - elementWidth - margin;
      if (newTop < margin) newTop = margin;
      if (newTop + elementHeight > windowHeight - margin) newTop = windowHeight - elementHeight - margin;

      // Aplica as novas posições
      element.style.top = newTop + "px";
      element.style.left = newLeft + "px";
  }

  function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  dragElement(document.getElementById("event-details"));
  dragElement(document.getElementById("event-form"));
});