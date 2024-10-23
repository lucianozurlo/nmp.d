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
  // Seleccionamos todos los videos con la clase "video-scroll"
  const videos = document.querySelectorAll ('.video-scroll');

  videos.forEach (video => {
    const bound = video.closest ('.scroll-bound');

    const scrollVideo = () => {
      if (video.duration) {
        const distanceFromTop =
          window.scrollY + bound.getBoundingClientRect ().top;
        const rawPercentScrolled =
          (window.scrollY - distanceFromTop) /
          (bound.scrollHeight - window.innerHeight);
        const percentScrolled = Math.min (Math.max (rawPercentScrolled, 0), 1);

        // Solo permitir que el video avance cuando esté centrado
        const videoRect = video.getBoundingClientRect ();
        const videoCenter = (videoRect.top + videoRect.bottom) / 2;
        const windowHeight = window.innerHeight;

        // Si el video está en el centro de la pantalla
        if (
          videoCenter >= windowHeight / 2 - 50 &&
          videoCenter <= windowHeight / 2 + 50
        ) {
          video.currentTime = video.duration * percentScrolled;
        }
      }

      requestAnimationFrame (scrollVideo);
    };

    requestAnimationFrame (scrollVideo);
  });
};

// Registrar los videos
registerVideos ();
