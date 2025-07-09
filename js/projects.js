document.addEventListener('DOMContentLoaded', () => {
   document.querySelectorAll('.splide').forEach((sliderEl) => {
      const startIndex = Number(sliderEl.dataset.start) || 0;

      const splide = new Splide(sliderEl, {
         type: 'loop',
         perPage: 5,
         focus: 'center',
         drag: true,
         snap: true,
         arrows: true,
         pagination: false,
         updateOnMove: true,
         speed: 600,
         start: startIndex,
      });

      splide.on('click', (slide) => {
         splide.go(slide.index);
      });

      splide.mount();
   });
});
