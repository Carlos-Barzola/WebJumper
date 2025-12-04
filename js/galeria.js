/* ========================
  CONFIGURACIÓN DE IMÁGENES
========================*/

//Se crea arreglos con las rutas de las imágenes para cada sección
// Sección 1 – Sabados
const fotosSabados = [
  "Imagenes/SAB1.jpeg",
  "Imagenes/SAB2.jpeg",
  "Imagenes/SAB3.jpeg",
  "Imagenes/SAB4.jpeg"
];

// Sección 2 – Comunidad
const fotosComunidad = [
  "Imagenes/Comu1.jpeg",
  "Imagenes/Comu2.jpeg",
  "Imagenes/comu1.jpeg",
  "Imagenes/Comu2.jpeg",
  "Imagenes/SAB1.jpeg",
  "Imagenes/Comu3.jpeg"
];

// Sección 3 – Eventos
const fotosEventos = [
  "Imagenes/Comu1.jpeg",
  "Imagenes/Comu2.jpeg",
  "Imagenes/SAB4.jpeg",
  "Imagenes/SAB2.jpeg"
];


// FUNCIÓN PARA CREAR CARRUSELES

/*Esta función prepara un contenedor para crear un carrusel de 
imágenes, pero primero verifica que el contenedor exista*/
function crearCarrusel(idContenedor, imagenes) { 
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  // ===DUPLICAR LAS IMÁGENES PARA EFECTO INFINITO ====
  //Crea un nuevo array que duplica las imágenes pasadas se hace usando "...".
  const imagenesExtendidas = [...imagenes, ...imagenes];

  // Crear wrapper carousel
  const wrapper = document.createElement("div");
  wrapper.classList.add("carousel-wrapper");
  wrapper.style.display = "flex"; //Organiza las imágenes en fila horizontal.
  wrapper.style.transition = "transform 0.6s ease"; //Permite animar el movimiento del carrusel

  // Insertar imágenes en el wrapper recorriendo el array
  imagenesExtendidas.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("carousel-img");
    wrapper.appendChild(img);
  });

  contenedor.appendChild(wrapper); //agrega el wrapper con todas las imágenes al contenedor principal

  // ====== Variables guardar imagenes y efecto infinito ======
  let index = 0;
  const total = imagenesExtendidas.length;

  // Tamaño de cada imagen 
  const paso = 395; // (380px imagen + 15px gap)

  let intervalo; //Variable que se usará para almacenar el intervalo que mueve el carrusel

  function mover() { //Función que mueve el carrusel una posición a la izquierda
    index++;
    wrapper.style.transform = `translateX(-${index * paso}px)`;

    // Reinicio invisible del ciclo
    if (index >= total / 2) { //Cuando llega a la mitad (fin del primer conjunto de imágenes)
      setTimeout(() => {
        wrapper.style.transition = "none";
        index = 0;
        wrapper.style.transform = `translateX(0px)`;
        setTimeout(() => {
          wrapper.style.transition = "transform 0.6s ease";
        }, 20);
      }, 600);
    }
  }

  function iniciar() { //Inicia el movimiento automático del carrusel
    intervalo = setInterval(mover, 3000); // desplaza imagenes cada 3s
  }

  function parar() { //Detiene el movimiento automático del carrusel.
    clearInterval(intervalo); //detiene el movimiento automático del carrusel.
  }

  // Imagenes se detienen al pasar el mouse sobre el carrusel
  wrapper.addEventListener("mouseenter", parar);
  wrapper.addEventListener("mouseleave", iniciar);

  iniciar();
}

// ========================
// INICIAR CARRUSELES
// ========================
crearCarrusel("carousel-sabados", fotosSabados);
crearCarrusel("carousel-comunidad", fotosComunidad);
crearCarrusel("carousel-eventos", fotosEventos);

