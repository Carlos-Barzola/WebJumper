// ========================
// CONFIGURACIÓN DE IMÁGENES
// ========================

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

// ========================
// FUNCIÓN PARA CREAR CARRUSELES
// ========================
function crearCarrusel(idContenedor, imagenes) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  // ====== A) DUPLICAR LAS IMÁGENES PARA EFECTO INFINITO ======
  const imagenesExtendidas = [...imagenes, ...imagenes];

  // Crear wrapper
  const wrapper = document.createElement("div");
  wrapper.classList.add("carousel-wrapper");
  wrapper.style.display = "flex";
  wrapper.style.transition = "transform 0.6s ease";

  // Insertar imágenes
  imagenesExtendidas.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("carousel-img");
    wrapper.appendChild(img);
  });

  contenedor.appendChild(wrapper);

  // ====== Variables para movimiento ======
  let index = 0;
  const total = imagenesExtendidas.length;

  // Tamaño de cada imagen (de acuerdo a tu CSS)
  const paso = 395; // (380px imagen + 15px gap)

  let intervalo;

  function mover() {
    index++;
    wrapper.style.transform = `translateX(-${index * paso}px)`;

    // Reinicio invisible del ciclo
    if (index >= total / 2) {
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

  function iniciar() {
    intervalo = setInterval(mover, 3000); // cada 3s
  }

  function parar() {
    clearInterval(intervalo);
  }

  // ====== B) DETENER AL PASAR EL MOUSE ======
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

