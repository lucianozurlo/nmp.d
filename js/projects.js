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
         breakpoints: {
            1279: {
               perPage: 3,
               focus: 'center',
               speed: 500,
            },
            767: {
               perPage: 1,
               focus: 'center',
               speed: 400,
            },
         },
      });

      // Click en cualquier slide lo centra
      splide.on('click', (slide) => splide.go(slide.index));

      splide.mount();
   });
});
