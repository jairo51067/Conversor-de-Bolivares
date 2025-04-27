window.onload = function() {
  const loadingImage = document.getElementById('loading-image');

  // Iniciar el desvanecimiento de la imagen de inmediato
  loadingImage.style.opacity = '0';

  // Esperar a que termine la transición
  setTimeout(() => {
      // Redirigir a la página deseada
      window.location.href = 'conversor.html'; // Cambia esto a la URL de tu proyecto
  }, 3500); // Debe coincidir con la duración de la transición en CSS
};