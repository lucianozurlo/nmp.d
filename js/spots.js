document.addEventListener ('DOMContentLoaded', () => {
  const containers = document.querySelectorAll ('.spots-container');

  containers.forEach (container => {
    const spots = container.querySelectorAll ('.spot');
    const messageBox = container.querySelector ('.message-box-spot');
    const lineElement = container.querySelector ('.line-spot');

    let hideTimeout;

    const showMessage = spot => {
      clearTimeout (hideTimeout); // Cancelar el ocultamiento si el mouse vuelve a entrar rápido
      const message = spot.getAttribute ('data-hover');
      const position = spot.getAttribute ('data-position') || 'bottom'; // "bottom" por defecto
      const linePercent =
        parseFloat (spot.getAttribute ('data-line-length')) || 5; // Longitud por defecto de 5%

      messageBox.textContent = message;
      messageBox.style.display = 'block';

      const spotRect = spot.getBoundingClientRect ();
      const containerRect = container.getBoundingClientRect ();

      // Calcular longitud en función del tamaño del contenedor (en porcentaje)
      const lineLength = linePercent / 100 * containerRect.width;

      // Añadir 22px de separación en cada dirección
      const lineOffset = 22;

      // Posicionar el mensaje y la línea según el atributo data-position
      switch (position) {
        case 'top':
          messageBox.style.top = `${(spotRect.top - containerRect.top - lineLength - messageBox.offsetHeight - lineOffset) / containerRect.height * 100}%`;
          messageBox.style.left = `${(spotRect.left - containerRect.left + spotRect.width / 2 - messageBox.offsetWidth / 2) / containerRect.width * 100}%`;
          lineElement.style.top = `${(spotRect.top - containerRect.top - lineLength - lineOffset) / containerRect.height * 100}%`;
          lineElement.style.left = `${(spotRect.left - containerRect.left + spotRect.width / 2) / containerRect.width * 100}%`;
          lineElement.style.width = `1px`;
          lineElement.style.height = `${lineLength}px`;
          break;

        case 'bottom':
          messageBox.style.top = `${(spotRect.bottom - containerRect.top + lineLength + lineOffset) / containerRect.height * 100}%`;
          messageBox.style.left = `${(spotRect.left - containerRect.left + spotRect.width / 2 - messageBox.offsetWidth / 2) / containerRect.width * 100}%`;
          lineElement.style.top = `${(spotRect.bottom - containerRect.top + lineOffset) / containerRect.height * 100}%`;
          lineElement.style.left = `${(spotRect.left - containerRect.left + spotRect.width / 2) / containerRect.width * 100}%`;
          lineElement.style.width = `1px`;
          lineElement.style.height = `${lineLength}px`;
          break;

        case 'left':
          messageBox.style.top = `${(spotRect.top - containerRect.top + spotRect.height / 2 - messageBox.offsetHeight / 2) / containerRect.height * 100}%`;
          messageBox.style.left = `${(spotRect.left - containerRect.left - messageBox.offsetWidth - lineLength - lineOffset) / containerRect.width * 100}%`;
          lineElement.style.top = `${(spotRect.top - containerRect.top + spotRect.height / 2) / containerRect.height * 100}%`;
          lineElement.style.left = `${(spotRect.left - containerRect.left - lineLength - lineOffset) / containerRect.width * 100}%`;
          lineElement.style.width = `${lineLength}px`;
          lineElement.style.height = `1px`;
          break;

        case 'right':
          messageBox.style.top = `${(spotRect.top - containerRect.top + spotRect.height / 2 - messageBox.offsetHeight / 2) / containerRect.height * 100}%`;
          messageBox.style.left = `${(spotRect.right - containerRect.left + lineLength + lineOffset) / containerRect.width * 100}%`;
          lineElement.style.top = `${(spotRect.top - containerRect.top + spotRect.height / 2) / containerRect.height * 100}%`;
          lineElement.style.left = `${(spotRect.right - containerRect.left + lineOffset) / containerRect.width * 100}%`;
          lineElement.style.width = `${lineLength}px`;
          lineElement.style.height = `1px`;
          break;

        default:
          break;
      }

      // Mostrar el mensaje y la línea
      messageBox.style.opacity = '1';
      lineElement.style.opacity = '1';
    };

    const hideMessage = () => {
      hideTimeout = setTimeout (() => {
        messageBox.style.opacity = '0'; // Ocultar el mensaje
        lineElement.style.opacity = '0'; // Ocultar la línea
      }, 150); // Retraso de 150ms antes de ocultar el mensaje y la línea
    };

    spots.forEach (spot => {
      spot.addEventListener ('mouseenter', () => showMessage (spot));
      spot.addEventListener ('mouseleave', hideMessage);
    });
  });
});
