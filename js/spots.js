document.addEventListener ('DOMContentLoaded', () => {
  const spots = document.querySelectorAll ('.spot');
  const messageBox = document.getElementById ('message-box-spot');
  const lineElement = document.getElementById ('line-spot');
  const container = document.querySelector ('.spots-container');

  const showMessage = spot => {
    const message = spot.getAttribute ('data-hover');
    const position = spot.getAttribute ('data-position') || 'bottom'; // "bottom" por defecto
    const lineLength =
      parseInt (spot.getAttribute ('data-line-length'), 10) || 50; // Longitud por defecto de 50px

    messageBox.textContent = message;
    messageBox.style.display = 'block';

    const spotRect = spot.getBoundingClientRect ();
    const containerRect = container.getBoundingClientRect ();

    // Posicionar el mensaje y la línea según el atributo data-position
    switch (position) {
      case 'top':
        messageBox.style.top = `${spotRect.top - containerRect.top - lineLength - messageBox.offsetHeight}px`;
        messageBox.style.left = `${spotRect.left - containerRect.left + spotRect.width / 2 - messageBox.offsetWidth / 2}px`;
        lineElement.style.top = `${spotRect.top - containerRect.top - lineLength}px`;
        lineElement.style.left = `${spotRect.left - containerRect.left + spotRect.width / 2}px`;
        lineElement.style.width = `1px`;
        lineElement.style.height = `${lineLength}px`;
        break;

      case 'bottom':
        messageBox.style.top = `${spotRect.bottom - containerRect.top + lineLength}px`;
        messageBox.style.left = `${spotRect.left - containerRect.left + spotRect.width / 2 - messageBox.offsetWidth / 2}px`;
        lineElement.style.top = `${spotRect.bottom - containerRect.top}px`;
        lineElement.style.left = `${spotRect.left - containerRect.left + spotRect.width / 2}px`;
        lineElement.style.width = `1px`;
        lineElement.style.height = `${lineLength}px`;
        break;

      case 'left':
        messageBox.style.top = `${spotRect.top - containerRect.top + spotRect.height / 2 - messageBox.offsetHeight / 2}px`;
        messageBox.style.left = `${spotRect.left - containerRect.left - messageBox.offsetWidth - lineLength}px`;
        lineElement.style.top = `${spotRect.top - containerRect.top + spotRect.height / 2}px`;
        lineElement.style.left = `${spotRect.left - containerRect.left - lineLength}px`;
        lineElement.style.width = `${lineLength}px`;
        lineElement.style.height = `1px`;
        break;

      case 'right':
        messageBox.style.top = `${spotRect.top - containerRect.top + spotRect.height / 2 - messageBox.offsetHeight / 2}px`;
        messageBox.style.left = `${spotRect.right - containerRect.left + lineLength}px`;
        lineElement.style.top = `${spotRect.top - containerRect.top + spotRect.height / 2}px`;
        lineElement.style.left = `${spotRect.right - containerRect.left}px`;
        lineElement.style.width = `${lineLength}px`;
        lineElement.style.height = `1px`;
        break;

      default:
        break;
    }

    // Iniciar la animación de opacidad
    messageBox.style.opacity = '1'; // Mostrar el mensaje
    lineElement.style.opacity = '1'; // Mostrar la línea
  };

  const hideMessage = () => {
    messageBox.style.opacity = '0'; // Ocultar el mensaje
    lineElement.style.opacity = '0'; // Ocultar la línea
  };

  spots.forEach (spot => {
    spot.addEventListener ('mouseenter', () => showMessage (spot));
    spot.addEventListener ('mouseleave', hideMessage);
  });
});
