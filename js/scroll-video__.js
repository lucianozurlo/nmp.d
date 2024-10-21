const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply (context, args);
      lastRan = Date.now ();
    } else {
      clearTimeout (lastFunc);
      lastFunc = setTimeout (function () {
        if (Date.now () - lastRan >= limit) {
          func.apply (context, args);
          lastRan = Date.now ();
        }
      }, limit - (Date.now () - lastRan));
    }
  };
};

const setScrollHeight = video => {
  const duration = video.duration;
  const scrollFactor = 500; // Relación scroll vs duración (ajustable)
  const scrollBound = video.closest ('.scroll-bound');
  scrollBound.style.height = `${scrollFactor * duration}vh`;
};

const registerVideos = () => {
  const videos = document.querySelectorAll ('.video-scroll');

  videos.forEach (video => {
    video.addEventListener ('loadedmetadata', () => {
      setScrollHeight (video);
    });

    const bound = video.closest ('.scroll-bound');
    let lastScrollY = 0; // Variable para rastrear la última posición del scroll

    const handleScroll = throttle (() => {
      const distanceFromTop =
        window.scrollY + bound.getBoundingClientRect ().top;
      const boundHeight = bound.scrollHeight - window.innerHeight;

      // Solo se actualiza el video si el scroll ha cambiado significativamente
      if (Math.abs (window.scrollY - lastScrollY) > 100) {
        lastScrollY = window.scrollY; // Actualiza la última posición del scroll

        if (
          window.scrollY > distanceFromTop &&
          window.scrollY < distanceFromTop + boundHeight
        ) {
          const rawPercentScrolled =
            (window.scrollY - distanceFromTop) / boundHeight;
          const percentScrolled = Math.min (
            Math.max (rawPercentScrolled, 0),
            1
          );
          video.currentTime = video.duration * percentScrolled;
        }
      }
    }, 100); // Throttle en 100ms

    window.addEventListener ('scroll', handleScroll);
  });
};

// Registrar los videos cuando el DOM esté listo
registerVideos ();
