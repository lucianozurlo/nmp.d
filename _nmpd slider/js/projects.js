document.addEventListener('DOMContentLoaded', () => {
   new Splide('.splide', {
      type: 'loop',
      perPage: 5,
      focus: 'center',
      drag: true,
      snap: true,
      arrows: true,
      pagination: false,
      updateOnMove: true,
      speed: 600,
   }).mount();
});
