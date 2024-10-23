window.addEventListener ('DOMContentLoaded', () => {
  const videoRestart = document.getElementById ('video-restart');

  const observer = new IntersectionObserver (entries => {
    entries.forEach (entry => {
      if (entry.isIntersecting) {
        console.log ('Video visible en el viewport');
        videoRestart.currentTime = 0;
        videoRestart.play ();
      } else {
        console.log ('Video fuera del viewport');
        videoRestart.pause ();
        videoRestart.currentTime = 0;
      }
    });
  });
  observer.observe (videoRestart);
});
