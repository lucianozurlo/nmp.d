// Parámetros para la secuencia de imágenes
const totalFrames = 60; // Número total de imágenes en la secuencia (30 frames por segundo)
const framePath = '../kali/seq30/seq'; // Ruta base de las imágenes
const imageFormat = '.png'; // Formato de imagen

// Función para obtener la ruta de la imagen actual
const getFramePath = index => {
  const frameNumber = String (index).padStart (2, '0'); // Cambiar a dos dígitos
  return `${framePath}${frameNumber}${imageFormat}`;
};

// Función para cambiar la imagen en función del scroll
const updateImageSequence = () => {
  const scrollBound = document.querySelector ('.scroll-bound');
  const imgElement = document.getElementById ('sequence-frame');

  const distanceFromTop =
    window.scrollY + scrollBound.getBoundingClientRect ().top;
  const scrollHeight = scrollBound.scrollHeight - window.innerHeight;
  const scrollProgress = Math.min (
    Math.max ((window.scrollY - distanceFromTop) / scrollHeight, 0),
    1
  );

  const frameIndex = Math.floor (scrollProgress * (totalFrames - 1)); // Empezar desde 0
  const newFrame = getFramePath (frameIndex);

  imgElement.src = newFrame;
};

// Evento de scroll para actualizar la secuencia
window.addEventListener ('scroll', updateImageSequence);

// Precargar las imágenes para mayor fluidez
const preloadImages = () => {
  for (let i = 0; i < totalFrames; i++) {
    // Iniciar desde 0
    const img = new Image ();
    img.src = getFramePath (i);
  }
};

// Iniciar el preloading de imágenes
preloadImages ();
